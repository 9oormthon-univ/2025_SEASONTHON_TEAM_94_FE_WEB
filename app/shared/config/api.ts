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
 * 개발 환경에서 사용할 Mock 사용자 UID
 */
export const MOCK_USER_UID = 'a';

/**
 * API 엔드포인트 상수
 */
export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/v1/transactions',
  TRANSACTION_BY_ID: (id: number) => `/api/v1/transactions/${id}`,
  TOTAL_PRICE: '/api/v1/transactions/total-price',
  CATEGORIES: '/api/v1/transactions/categories',
} as const;
