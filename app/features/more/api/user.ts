// features/more/api/user.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS, MOCK_USER_UID } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

type CurrentUserApi = {
  id: string;        
  role: string;
  username: string;
  nickname: string;
};

export type CurrentUser = {
  name: string;      
  email: string;    
  userUid?: string;
};

export async function fetchCurrentUser(userUid = MOCK_USER_UID): Promise<CurrentUser> {
  try {
    const res = await httpClient.get<ApiResponse<CurrentUserApi>>(
      `${API_ENDPOINTS.USERS_ME}?userUid=${encodeURIComponent(userUid)}`
    );
    const u = res.data;
    return {
      name: (u.nickname?.trim() || u.username?.trim() || '사용자'),
      email: '',              // 백엔드 응답에 없으니 비워둠
      userUid: u.id,
    };
  } catch {
    // 퍼블리싱 단계: 목업
    return { name: '여울', email: 'yunsooga@gmail.com', userUid };
  }
}

export async function logout(): Promise<void> {
  await httpClient.post<unknown>(API_ENDPOINTS.AUTH_LOGOUT);
}
