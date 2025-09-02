/**
 * 지출 변이(생성/수정/삭제) 관련 TanStack Query 훅들
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createTransaction,
  createTransactionByAlert,
  updateTransaction,
  deleteTransaction,
} from '@/features/expenses/api/expenseApi';
import { expenseKeys } from '@/features/expenses/api/queryKeys';
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionCreateByAlertRequest,
  TransactionUpdateRequest,
} from '@/shared/types/expense';

/**
 * 지출 생성 훅
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onMutate: async (newExpense: TransactionCreateRequest) => {
      // 낙관적 업데이트를 위해 관련 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: expenseKeys.all });

      // 이전 데이터 백업
      const previousExpenses = queryClient.getQueriesData({ 
        queryKey: expenseKeys.all 
      });

      // 낙관적 업데이트: 새 지출을 임시로 추가
      const tempExpense: Transaction = {
        id: Date.now(), // 임시 ID
        price: newExpense.price,
        title: newExpense.title,
        type: newExpense.type || 'NONE',
        userUid: newExpense.userUid,
        category: newExpense.category || 'OTHER',
        startedAt: newExpense.startAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 관련 쿼리들에 낙관적 업데이트 적용
      queryClient.setQueriesData(
        { queryKey: expenseKeys.lists() },
        (old: Transaction[] | undefined) => 
          old ? [tempExpense, ...old] : [tempExpense]
      );

      return { previousExpenses, tempExpense };
    },
    onSuccess: (data, variables, context) => {
      // 성공 시 캐시 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('지출이 성공적으로 저장되었습니다!');
    },
    onError: (error, variables, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previousExpenses) {
        context.previousExpenses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      const message = error instanceof Error 
        ? error.message 
        : '지출 저장에 실패했습니다.';
      toast.error(message);
    },
    onSettled: () => {
      // 항상 관련 쿼리들 재조회하여 일관성 보장
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

/**
 * 알림을 통한 지출 생성 훅
 */
export function useCreateExpenseByAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransactionByAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('알림을 통해 지출이 저장되었습니다!');
    },
    onError: (error) => {
      const message = error instanceof Error 
        ? error.message 
        : '알림을 통한 지출 저장에 실패했습니다.';
      toast.error(message);
    },
  });
}

/**
 * 지출 수정 훅
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userUid, id, data }: {
      userUid: string;
      id: number;
      data: TransactionUpdateRequest;
    }) => updateTransaction(userUid, id, data),
    onMutate: async ({ userUid, id, data }) => {
      // 관련 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: expenseKeys.all });

      // 이전 데이터 백업
      const previousExpenses = queryClient.getQueriesData({ 
        queryKey: expenseKeys.all 
      });

      // 낙관적 업데이트: 기존 지출 수정
      queryClient.setQueriesData(
        { queryKey: expenseKeys.lists() },
        (old: Transaction[] | undefined) => 
          old?.map(expense => 
            expense.id === id 
              ? { ...expense, ...data, updatedAt: new Date().toISOString() }
              : expense
          )
      );

      // 개별 상세 쿼리도 업데이트
      const detailQueryKey = expenseKeys.detail(userUid, id);
      queryClient.setQueryData(
        detailQueryKey,
        (old: Transaction | undefined) => 
          old ? { ...old, ...data, updatedAt: new Date().toISOString() } : old
      );

      return { previousExpenses };
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('지출이 성공적으로 수정되었습니다!');
    },
    onError: (error, variables, context) => {
      // 실패 시 롤백
      if (context?.previousExpenses) {
        context.previousExpenses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      const message = error instanceof Error 
        ? error.message 
        : '지출 수정에 실패했습니다.';
      toast.error(message);
    },
  });
}

/**
 * 지출 삭제 훅
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userUid, id }: { userUid: string; id: number }) => 
      deleteTransaction(userUid, id),
    onMutate: async ({ userUid, id }) => {
      // 관련 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: expenseKeys.all });

      // 이전 데이터 백업
      const previousExpenses = queryClient.getQueriesData({ 
        queryKey: expenseKeys.all 
      });

      // 낙관적 업데이트: 지출 제거
      queryClient.setQueriesData(
        { queryKey: expenseKeys.lists() },
        (old: Transaction[] | undefined) => 
          old?.filter(expense => expense.id !== id)
      );

      // 개별 상세 쿼리 제거
      queryClient.removeQueries({ 
        queryKey: expenseKeys.detail(userUid, id) 
      });

      return { previousExpenses };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('지출이 성공적으로 삭제되었습니다!');
    },
    onError: (error, variables, context) => {
      // 실패 시 롤백
      if (context?.previousExpenses) {
        context.previousExpenses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      const message = error instanceof Error 
        ? error.message 
        : '지출 삭제에 실패했습니다.';
      toast.error(message);
    },
  });
}
