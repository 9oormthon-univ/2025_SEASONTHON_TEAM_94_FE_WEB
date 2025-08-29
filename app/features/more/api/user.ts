// src/api/user.ts
import { request } from './index';

export type CurrentUser = {
  name: string;
  email: string;
};

export async function fetchCurrentUser(): Promise<CurrentUser> {
  // 퍼블리싱 단계: 목업 데이터 반환
  return {
    name: '여울',
    email: 'yunsooga@gmail.com',
  };
}

export async function logout(): Promise<void> {
  await request<void>('/api/logout', 'POST');
}
