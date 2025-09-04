/**
 * User 조회 관련 TanStack Query 훅들
 */

import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/features/auth/api/userApi';
import { userQueries } from '@/features/auth/api/queryKeys';
import type { UserResponse } from '@/shared/types/user';

/**
 * 현재 사용자 정보 조회 훅
 */
export function useMe() {
  return useQuery({
    ...userQueries.me(),
    queryFn: fetchMe,
  });
}
