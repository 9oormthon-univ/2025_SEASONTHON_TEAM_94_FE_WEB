/**
 * 지출 관련 Query Key 팩토리
 * TanStack Query의 쿼리 키를 일관성 있게 관리하기 위한 팩토리 함수들
 */

import type { ExpenseType, TransactionFilter } from '@/shared/types/expense';

// 기본 쿼리 키 네임스페이스
export const expenseKeys = {
  // 모든 지출 관련 쿼리
  all: ['expenses'] as const,

  // 지출 목록 쿼리들
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filter: TransactionFilter) =>
    [...expenseKeys.lists(), filter] as const,

  // 개별 지출 상세 쿼리들
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: number) => [...expenseKeys.details(), id] as const,

  // 리포트 관련 쿼리들
  reports: () => [...expenseKeys.all, 'report'] as const,
  report: (filter: TransactionFilter) =>
    [...expenseKeys.reports(), filter] as const,

  // 카테고리 관련 쿼리들
  categories: () => [...expenseKeys.all, 'categories'] as const,
} as const;

// Query Option 팩토리 함수들
export const expenseQueries = {
  // 지출 목록 조회를 위한 옵션
  list: (filter: TransactionFilter) => ({
    queryKey: expenseKeys.list(filter),
    staleTime: 1000 * 60 * 3, // 3분
    meta: {
      errorMessage: '지출 목록을 불러오는데 실패했습니다.',
    },
  }),

  // 개별 지출 상세 조회를 위한 옵션
  detail: (id: number) => ({
    queryKey: expenseKeys.detail(id),
    staleTime: 1000 * 60 * 10, // 10분 (상세 정보는 더 오래 캐시)
    meta: {
      errorMessage: '지출 상세 정보를 불러오는데 실패했습니다.',
    },
  }),

  // 리포트 조회를 위한 옵션
  report: (filter: TransactionFilter) => ({
    queryKey: expenseKeys.report(filter),
    staleTime: 1000 * 60 * 3, // 3분 (리포트는 자주 변경될 수 있음)
    meta: {
      errorMessage: '지출 리포트를 불러오는데 실패했습니다.',
    },
  }),

  // 카테고리 목록 조회를 위한 옵션
  categories: () => ({
    queryKey: expenseKeys.categories(),
    staleTime: 1000 * 60 * 30, // 30분 (카테고리는 거의 변경되지 않음)
    meta: {
      errorMessage: '카테고리 목록을 불러오는데 실패했습니다.',
    },
  }),
} as const;
