/**
 * 지출 관련 Mutation 훅들
 * TanStack Query의 useMutation을 이용한 생성, 수정, 삭제 기능
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
        bankName: newExpense.bankName,
        memo: '',
        splitCount: newExpense.splitCount,
        type: newExpense.type || 'NONE',
        userUid: '', // 서버에서 설정됨
        category: newExpense.category || 'OTHER',
        startedAt: newExpense.startAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 목록 쿼리들에 임시 데이터 추가
      queryClient.setQueriesData(
        { queryKey: expenseKeys.lists() },
        (old: Transaction[] | undefined) => 
          old ? [tempExpense, ...old] : [tempExpense]
      );

      return { previousExpenses };
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
    mutationFn: ({ id, data }: {
      id: number;
      data: TransactionUpdateRequest;
    }) => updateTransaction(id, data),
    onMutate: async ({ id, data }) => {
      // 관련 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: expenseKeys.all });

      // 이전 데이터 백업
      const previousExpenses = queryClient.getQueriesData({ 
        queryKey: expenseKeys.all 
      });

      // 낙관적 업데이트
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
      const detailQueryKey = expenseKeys.detail(id);
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

/**
 * 지출 삭제 훅
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      deleteTransaction(id),
    onMutate: async (id: number) => {
      // 관련 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: expenseKeys.all });

      // 이전 데이터 백업
      const previousExpenses = queryClient.getQueriesData({ 
        queryKey: expenseKeys.all 
      });

      // 낙관적 업데이트: 해당 지출 제거
      queryClient.setQueriesData(
        { queryKey: expenseKeys.lists() },
        (old: Transaction[] | undefined) =>
          old?.filter(expense => expense.id !== id)
      );

      // 상세 쿼리도 제거
      queryClient.removeQueries({
        queryKey: expenseKeys.detail(id)
      });

      return { previousExpenses };
    },
    onSuccess: (data, variables) => {
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

// 기존 호환성을 위한 별칭들
export const useCreateTransaction = useCreateExpense;
export const useCreateTransactionByAlert = useCreateExpenseByAlert;
export const useUpdateTransaction = useUpdateExpense;
export const useDeleteTransaction = useDeleteExpense;
