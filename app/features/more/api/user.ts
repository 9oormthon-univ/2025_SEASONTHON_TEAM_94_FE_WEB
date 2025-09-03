// features/more/api/user.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS, MOCK_USER_UID } from '@/shared/config/api';
import { clearAuthCookies } from '@/shared/utils/cookie';
import type { ApiResponse } from '@/shared/types/api';

type CurrentUserApi = {
  id: string;        
  role: string;
  username: string;
  nickname: string;
  email: string;  // 스웨거 응답에 포함됨
};

export type CurrentUser = {
  name: string;      
  email: string;    
  userUid?: string;
};

export async function fetchCurrentUser(userUid = MOCK_USER_UID): Promise<CurrentUser> {
  try {
    const res = await httpClient.get<ApiResponse<CurrentUserApi>>(
      API_ENDPOINTS.USERS_ME
    );
    const u = res.data;
    return {
      name: (u.nickname?.trim() || u.username?.trim() || '사용자'),
      email: u.email || '',  // 스웨거 응답에 email 필드 포함
      userUid: u.id,
    };
  } catch {
    // 퍼블리싱 단계: 목업
    return { name: '여울', email: 'yunsooga@gmail.com', userUid };
  }
}

export async function logout(): Promise<void> {
  // 스웨거에 로그아웃 API가 없으므로 클라이언트 측에서 쿠키 삭제
  clearAuthCookies();
  
  // 페이지 새로고침으로 인증 상태 리셋
  if (typeof window !== 'undefined') {
    window.location.href = '/auth';
  }
}
