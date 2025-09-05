// features/profile/api/user.ts
import { httpService } from '@/shared/utils/httpClient';
import type { ApiResponse } from '@/shared/types/api';
import { clearAuthCookies } from '@/shared/utils/cookie';


export interface UserResponse {
  id: string;
  role: 'ROLE_USER' | string;
  username: string;
  nickname: string;
  email: string;           
}

export async function getMe(signal?: AbortSignal) {
  const res = await httpService.get<ApiResponse<UserResponse>>(
    '/api/v1/users/me',
    {},
    { ...(signal ? { signal } as any : {}) }
  );
  return res.data;
}

export async function updateNickname(nickname: string, signal?: AbortSignal) {
  const res = await httpService.put<ApiResponse<UserResponse>>(
    '/api/v1/users',
    { nickname },
    { ...(signal ? { signal } as any : {}) }
  );
  return res.data;
}

export async function logout(): Promise<void> {
  // 스웨거에 로그아웃 API가 없으므로 클라이언트 측에서 쿠키 삭제
  clearAuthCookies();
  
  // 페이지 새로고침으로 인증 상태 리셋
  if (typeof window !== 'undefined') {
    window.location.href = '/auth';
  }
}
