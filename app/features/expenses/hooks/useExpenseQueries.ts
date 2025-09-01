/**
 * 지출 조회 관련 TanStack Query 훅들
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchTransactions,
  fetchTransactionById,
  fetchTransactionReport,
  fetchCategories,
  fetchTotalPriceByType,
} from '@/features/expenses/api/expenseApi';
import { expenseKeys, expenseQueries } from '@/features/expenses/api/queryKeys';
import type {
  Transaction,
  TransactionFilter,
  TransactionReportResponse,
  TransactionCategoryResponse,
  ExpenseType,
} from '@/shared/types/expense';

/**
 * 지출 목록 조회 훅
 */
export function useExpenses(filter: TransactionFilter) {
  return useQuery({
    ...expenseQueries.list(filter),
    queryFn: () => fetchTransactions(filter),
    enabled: !!filter.userUid, // userUid가 있을 때만 실행
  });
}

/**
 * 특정 타입의 지출 목록 조회 훅
 */
export function useExpensesByType(userUid: string, type: ExpenseType) {
  const filter: TransactionFilter = { userUid, type };
  
  return useQuery({
    ...expenseQueries.list(filter),
    queryFn: () => fetchTransactions(filter),
    enabled: !!userUid,
  });
}

/**
 * 개별 지출 상세 조회 훅
 */
export function useExpenseDetail(userUid: string, id: number) {
  return useQuery({
    ...expenseQueries.detail(userUid, id),
    queryFn: () => fetchTransactionById(userUid, id),
    enabled: !!userUid && !!id,
  });
}

/**
 * 지출 리포트 조회 훅
 */
export function useExpenseReport(filter: TransactionFilter) {
  return useQuery({
    ...expenseQueries.report(filter),
    queryFn: () => fetchTransactionReport(filter),
    enabled: !!filter.userUid,
  });
}

/**
 * 카테고리 목록 조회 훅
 */
export function useExpenseCategories() {
  return useQuery({
    ...expenseQueries.categories(),
    queryFn: fetchCategories,
  });
}

/**
 * 타입별 총 금액 조회 훅
 */
export function useExpenseTotalByType(
  userUid: string,
  type: ExpenseType,
  startAt?: string,
  endAt?: string
) {
  return useQuery({
    queryKey: expenseKeys.totalByType(userUid, type, startAt, endAt),
    queryFn: () => fetchTotalPriceByType(userUid, type, startAt, endAt),
    enabled: !!userUid,
    staleTime: 1000 * 60 * 3, // 3분
    meta: {
      errorMessage: '총 금액을 불러오는데 실패했습니다.',
    },
  });
}

/**
 * 미분류 지출 목록 조회 훅 (NONE 타입)
 */
export function useUncategorizedExpenses(userUid: string) {
  return useExpensesByType(userUid, 'NONE');
}

/**
 * 분류된 지출 목록 조회 훅 (OVER_EXPENSE + FIXED_EXPENSE)
 */
export function useCategorizedExpenses(userUid: string) {
  const overExpenses = useExpensesByType(userUid, 'OVER_EXPENSE');
  const fixedExpenses = useExpensesByType(userUid, 'FIXED_EXPENSE');

  return {
    // 로딩 상태: 둘 중 하나라도 로딩 중이면 true
    isLoading: overExpenses.isLoading || fixedExpenses.isLoading,
    
    // 에러 상태: 둘 중 하나라도 에러가 있으면 해당 에러
    error: overExpenses.error || fixedExpenses.error,
    
    // 데이터: 두 타입을 합쳐서 반환
    data: overExpenses.data && fixedExpenses.data 
      ? [...overExpenses.data, ...fixedExpenses.data] 
      : undefined,
      
    // 개별 쿼리 상태도 노출
    overExpenses,
    fixedExpenses,
    
    // 리페치 함수
    refetch: async () => {
      await Promise.all([
        overExpenses.refetch(),
        fixedExpenses.refetch(),
      ]);
    },
  };
}
