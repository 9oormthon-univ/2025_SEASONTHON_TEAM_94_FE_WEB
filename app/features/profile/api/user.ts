// features/profile/api/user.ts  
import { httpService } from '@/shared/utils/httpClient';

export interface UserResponse {
  id: string;
  username: string;
  nickname: string;
  role: 'ROLE_USER' | string;
}
export interface ApiResponse<T> { success: boolean; status: number; code: string; message: string; data: T; }

export async function updateNickname(
  userUid: string,
  nickname: string,
  signal?: AbortSignal
): Promise<UserResponse> {
  const endpoint = `/api/v1/users?userUid=${encodeURIComponent(userUid)}`;
  const res = await httpService.put<ApiResponse<UserResponse>>(
    endpoint,
    { nickname },
    { headers: { 'Content-Type': 'application/json' }, timeout: 10000, ...(signal ? { signal } as any : {}) }
  );
  return res.data;
}
