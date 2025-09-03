// features/profile/api/user.ts
import { httpService } from '@/shared/utils/httpClient';
import type { ApiResponse } from '@/shared/types/api';


export interface UserResponse {
  id: string;         
  username: string;    
  nickname: string;   
  role: 'ROLE_USER' | string;
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
