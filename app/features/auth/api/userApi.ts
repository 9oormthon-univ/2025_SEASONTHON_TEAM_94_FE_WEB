/**
 * User 관련 API 함수들
 * Swagger 스펙: UserController
 */

import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';
import type {
  UserResponse,
  UserUpdateRequest,
} from '@/shared/types/user';

/**
 * 현재 사용자 정보 조회
 * Swagger 스펙: GET /api/v1/users/me
 */
export async function fetchMe(): Promise<UserResponse> {
  const response = await httpClient.get<ApiResponse<UserResponse>>(
    API_ENDPOINTS.USERS_ME
  );
  return response.data;
}

/**
 * 사용자 정보 수정
 * Swagger 스펙: PUT /api/v1/users
 */
export async function updateUser(
  userUpdate: UserUpdateRequest
): Promise<UserResponse> {
  const response = await httpClient.put<ApiResponse<UserResponse>>(
    API_ENDPOINTS.USERS,
    userUpdate
  );
  return response.data;
}

/**
 * 개발용 로그인
 * Swagger 스펙: POST /dev/login
 */
export async function devLogin(userUid: string): Promise<string> {
  const response = await httpClient.post<string>(
    `${API_ENDPOINTS.DEV_LOGIN}?userUid=${userUid}`
  );
  return response;
}
