/**
 * User 변경 관련 TanStack Query Mutation 훅들
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, devLogin } from '@/features/auth/api/userApi';
import { userKeys } from '@/features/auth/api/queryKeys';
import type { UserUpdateRequest, UserResponse } from '@/shared/types/user';

/**
 * 사용자 정보 수정 훅
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userUpdate: UserUpdateRequest) => updateUser(userUpdate),
    onSuccess: (data: UserResponse) => {
      // 현재 사용자 쿼리 업데이트
      queryClient.setQueryData(userKeys.me(), data);
    },
    meta: {
      errorMessage: '사용자 정보 수정에 실패했습니다.',
      successMessage: '사용자 정보가 수정되었습니다.',
    },
  });
}

/**
 * 개발용 로그인 훅
 */
export function useDevLogin() {
  return useMutation({
    mutationFn: (userUid: string) => devLogin(userUid),
    meta: {
      errorMessage: '개발용 로그인에 실패했습니다.',
      successMessage: '로그인되었습니다.',
    },
  });
}
