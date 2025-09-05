/**
 * 지출 API 관련 표준화된 타입 정의
 */

// 표준 API 응답 타입
export interface StandardApiResponse<T> {
  success: boolean;
  status: number;
  code: string;
  message: string;
  data: T;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  success: false;
  status: number;
  code: string;
  message: string;
  data: null;
  errors?: Record<string, string[]>;
}

// API 요청 상태 타입
export type ApiRequestStatus = 'idle' | 'loading' | 'success' | 'error';

// API 요청 결과 타입
export interface ApiRequestResult<T> {
  data: T | null;
  status: ApiRequestStatus;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// 페이지네이션 메타데이터 타입
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 페이지네이션된 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// API 엔드포인트 타입
export type ApiEndpoint = 
  | 'GET /api/v1/transactions'
  | 'GET /api/v1/transactions/{id}'
  | 'POST /api/v1/transactions'
  | 'PUT /api/v1/transactions/{id}'
  | 'DELETE /api/v1/transactions/{id}'
  | 'GET /api/v1/transactions/report'
  | 'GET /api/v1/transactions/categories'
  | 'POST /api/v1/transactions/alarm';

// API 메서드 타입
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 요청 옵션 타입
export interface ApiRequestOptions {
  method: ApiMethod;
  endpoint: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

// API 응답 헤더 타입
export interface ApiResponseHeaders {
  'content-type'?: string;
  'content-length'?: string;
  'cache-control'?: string;
  'etag'?: string;
  'last-modified'?: string;
}

// API 클라이언트 설정 타입
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
}

// API 캐시 설정 타입
export interface ApiCacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number;
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}

// API 요청 인터셉터 타입
export type RequestInterceptor = (config: ApiRequestOptions) => ApiRequestOptions | Promise<ApiRequestOptions>;

// API 응답 인터셉터 타입
export type ResponseInterceptor<T = any> = (response: StandardApiResponse<T>) => StandardApiResponse<T> | Promise<StandardApiResponse<T>>;

// API 에러 인터셉터 타입
export type ErrorInterceptor = (error: any) => any | Promise<any>;

// API 클라이언트 인터셉터 설정 타입
export interface ApiInterceptors {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
  error: ErrorInterceptor[];
}

// API 클라이언트 전체 설정 타입
export interface ApiClientSettings {
  config: ApiClientConfig;
  cache: ApiCacheConfig;
  interceptors: ApiInterceptors;
}

// API 요청 컨텍스트 타입
export interface ApiRequestContext {
  requestId: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
}

// API 응답 메타데이터 타입
export interface ApiResponseMeta {
  requestId: string;
  timestamp: Date;
  duration: number;
  cacheHit: boolean;
  retryCount: number;
}

// 확장된 API 응답 타입
export interface ExtendedApiResponse<T> extends StandardApiResponse<T> {
  meta: ApiResponseMeta;
}

// API 요청 로그 타입
export interface ApiRequestLog {
  id: string;
  method: ApiMethod;
  endpoint: string;
  status: number;
  duration: number;
  timestamp: Date;
  requestSize: number;
  responseSize: number;
  error?: string;
}

// API 메트릭 타입
export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
}

// API 헬스체크 타입
export interface ApiHealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  responseTime: number;
  version: string;
  dependencies: Record<string, 'up' | 'down' | 'unknown'>;
}
