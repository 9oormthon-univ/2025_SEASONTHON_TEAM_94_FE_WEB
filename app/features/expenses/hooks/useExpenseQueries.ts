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
  TransactionResponse,
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
    enabled: !!filter.type, // type이 있을 때만 실행
  });
}

/**
 * 특정 타입의 지출 목록 조회 훅
 */
export function useExpensesByType(type: ExpenseType) {
  const filter: TransactionFilter = { type };
  
  return useQuery({
    ...expenseQueries.list(filter),
    queryFn: () => fetchTransactions(filter),
    enabled: !!type,
  });
}

/**
 * 개별 지출 상세 조회 훅
 */
export function useExpenseDetail(id: number) {
  return useQuery({
    ...expenseQueries.detail(id),
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
  });
}

/**
 * 지출 리포트 조회 훅
 */
export function useExpenseReport(filter: TransactionFilter) {
  return useQuery({
    ...expenseQueries.report(filter),
    queryFn: () => fetchTransactionReport(filter),
    enabled: !!filter.type, // type이 required이므로 type 체크
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
  type: ExpenseType,
  startAt?: string,
  endAt?: string
) {
  return useQuery({
    queryKey: expenseKeys.totalByType(type, startAt, endAt),
    queryFn: () => fetchTotalPriceByType(type, startAt, endAt),
    enabled: !!type,
    staleTime: 1000 * 60 * 3, // 3분
    meta: {
      errorMessage: '총 금액을 불러오는데 실패했습니다.',
    },
  });
}

/**
 * 미분류 지출 목록 조회 훅 (NONE 타입)
 */
export function useUncategorizedExpenses() {
  return useExpensesByType('NONE');
}

/**
 * 분류된 지출 목록 조회 훅 (OVER_EXPENSE + FIXED_EXPENSE)
 */
export function useCategorizedExpenses() {
  const overExpenses = useExpensesByType('OVER_EXPENSE');
  const fixedExpenses = useExpensesByType('FIXED_EXPENSE');

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
