/**
 * API 설정
 */

export function getApiBaseUrl(): string {
  // 환경변수에서 API URL 가져오기
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;

  // 기본값
  return 'https://api.stopusing.klr.kr';
}

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10초
  RETRY_COUNT: 3,
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: 'stopusing_auth_token',
  REFRESH_TOKEN_KEY: 'stopusing_refresh_token',
  TOKEN_EXPIRY_KEY: 'stopusing_token_expiry',
} as const;

/**
 * API 엔드포인트 상수 (Swagger 스펙 기준)
 */
export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/v1/transactions',
  TRANSACTION_BY_ID: (id: number) => `/api/v1/transactions/${id}`,
  TRANSACTIONS_REPORT: '/api/v1/transactions/report',
  TRANSACTIONS_ALARM: '/api/v1/transactions/alarm',
  CATEGORIES: '/api/v1/transactions/categories',

  // budget goals
  BUDGET_GOALS: '/api/v1/budgetgoals',
  BUDGET_GOAL_BY_ID: (id: number) => `/api/v1/budgetgoals/${id}`,

  // user/auth (실제 백엔드 경로와 다르면 여기만 바꾸면 됨)
  USERS_ME: '/api/v1/users/me',
  USERS: '/api/v1/users',
  
  // 개발용 로그인
  DEV_LOGIN: '/dev/login',
} as const;
