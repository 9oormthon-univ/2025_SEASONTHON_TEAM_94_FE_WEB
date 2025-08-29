// features/more/api/user.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS, MOCK_USER_UID } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

export type CurrentUser = {
  name: string;
  email: string;
  userUid?: string;
};

// 실제 API 호출 (실패 시 퍼블리싱용 목업으로 fallback)
export async function fetchCurrentUser(): Promise<CurrentUser> {
  try {
    const res = await httpClient.get<ApiResponse<CurrentUser>>(
      API_ENDPOINTS.USERS_ME
    );
    return res.data;
  } catch {
    // 퍼블리싱 단계: 목업
    return { name: '여울', email: 'yunsooga@gmail.com', userUid: MOCK_USER_UID };
  }
}

export async function logout(): Promise<void> {
  // 응답 래퍼가 없을 수도 있어 unknown으로 받아만 줌
  await httpClient.post<unknown>(API_ENDPOINTS.AUTH_LOGOUT);
}
