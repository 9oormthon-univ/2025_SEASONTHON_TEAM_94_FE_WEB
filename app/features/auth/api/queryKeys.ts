/**
 * User 관련 Query Key 팩토리
 * TanStack Query의 쿼리 키를 일관성 있게 관리하기 위한 팩토리 함수들
 */

// User 쿼리 키 네임스페이스
export const userKeys = {
  // 모든 User 관련 쿼리
  all: ['users'] as const,
  
  // 현재 사용자 쿼리
  me: () => [...userKeys.all, 'me'] as const,
} as const;

// Query Option 팩토리 함수들
export const userQueries = {
  // 현재 사용자 조회를 위한 옵션
  me: () => ({
    queryKey: userKeys.me(),
    staleTime: 1000 * 60 * 10, // 10분
    meta: {
      errorMessage: '사용자 정보를 불러오는데 실패했습니다.',
    },
  }),
} as const;
