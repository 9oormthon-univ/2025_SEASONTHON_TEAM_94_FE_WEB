import { getApiBaseUrl, API_CONFIG, AUTH_CONFIG } from '@/shared/config/api';
import { clearAuthCookies, getCookie } from '@/shared/utils/cookie';

const TIMEOUT_DURATION = API_CONFIG.TIMEOUT;
const MAX_RETRIES = API_CONFIG.RETRY_COUNT;
const RETRY_DELAY = 1000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestBody =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null
  | object;

interface HttpRequestConfig {
  method?: HttpMethod;
  body?: RequestBody;
  headers?: Record<string, string>;
  retries?: number;
  timeout?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

// 에러 타입들
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
    public responseBody?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = '요청이 시간 초과되었습니다') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// 재시도 로직
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shouldRetry(
  error: Error,
  attempt: number,
  maxRetries: number
): boolean {
  if (attempt >= maxRetries) return false;

  // 네트워크 에러나 5xx 에러만 재시도
  if (error instanceof NetworkError) return true;
  if (error instanceof HttpError && error.status >= 500) return true;

  return false;
}

// 환경 감지 함수
function isServerEnvironment(): boolean {
  return typeof window === 'undefined';
}

export class HttpService {
  private headerInterceptor?: () => Record<string, string>;

  constructor() {
    // 쿠키 기반 인증 + 서버가 Authorization 헤더를 기대할 수 있으므로
    // Authorization 쿠키가 접근 가능하면 Bearer 헤더를 추가합니다.
    this.setHeaderInterceptor(() => {
      const headers: Record<string, string> = {};
      try {
        const token = getCookie('Authorization');
        if (token) {
          headers['Authorization'] = headers['Authorization'] || `Bearer ${token}`;
        }
      } catch {
        // ignore
      }
      return headers;
    });
  }

  setHeaderInterceptor(interceptor: () => Record<string, string>) {
    this.headerInterceptor = interceptor;
  }

  private clearAuthData(): void {
    console.log('[HttpClient] clearAuthData 호출됨');
    
    if (typeof window !== 'undefined') {
      // 쿠키 기반 인증에서는 클라이언트 측에서 쿠키를 삭제
      console.log('[HttpClient] 인증 쿠키 삭제 중...');
      clearAuthCookies();
      
      // 기존 localStorage/sessionStorage 정리 (혹시 남아있을 수 있는 데이터)
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      
      console.log('[HttpClient] 인증 데이터 삭제 완료');
    }
  }

  // 환경별 URL 생성
  private createUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    let apiPath: string;

    if (endpoint.startsWith('http')) {
      // 절대 URL인 경우 그대로 사용
      apiPath = endpoint;
    } else if (endpoint.startsWith('/')) {
      // 이미 /로 시작하는 경우 (우리 프로젝트의 경우)
      apiPath = endpoint;
    } else {
      // 상대 경로인 경우 API 베이스 경로 추가
      apiPath = `/api/v1/${endpoint}`;
    }

    // 환경별 URL 생성
    let fullUrl: string;
    if (isServerEnvironment()) {
      // 서버 사이드 렌더링 환경에서는 풀 URL 필요
      const baseUrl = getApiBaseUrl();
      if (!baseUrl) {
        throw new Error('API Base URL이 설정되지 않았습니다');
      }
      fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${apiPath}`;
    } else {
      // 클라이언트 환경에서는 직접 API 서버로 요청
      if (endpoint.startsWith('http')) {
        fullUrl = endpoint;
      } else {
        // 개발 환경에서는 프록시를 통해, 프로덕션에서는 직접 API 서버로
        const baseUrl = getApiBaseUrl();
        fullUrl = `${baseUrl}${apiPath}`;
      }
    }

    // 쿼리 파라미터 추가
    if (params) {
      const url = new URL(fullUrl);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
      return url.toString();
    }

    return fullUrl;
  }

  private getHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    // 기본적으로 GET 같은 바디 없는 요청에 Content-Type을 강제로 넣지 않기 위해 비워둔다.
    const baseHeaders: Record<string, string> = {};
    const interceptedHeaders = this.headerInterceptor?.() || {};

    return {
      ...baseHeaders,
      ...interceptedHeaders,
      ...customHeaders, // 커스텀 헤더가 최우선
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // 401 에러 처리 - 일시적으로 비활성화하여 디버깅
      if (response.status === 401) {
        console.log('[HttpClient] 401 에러 감지:', {
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          willClearCookies: false // 디버깅을 위해 비활성화
        });
        
        // 일시적으로 쿠키 삭제와 리다이렉트 비활성화
        // this.clearAuthData();
        // if (typeof window !== 'undefined') {
        //   console.log('[HttpClient] /auth로 리다이렉트');
        //   window.location.href = '/auth';
        // }
      }

      let responseBody: unknown;
      try {
        responseBody = await response.json();
      } catch {
        try {
          responseBody = await response.text();
        } catch {
          responseBody = null;
        }
      }

      const message = `HTTP ${response.status}: ${response.statusText}`;
      throw new HttpError(message, response.status, response, responseBody);
    }

    try {
      const data: unknown = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(
        '응답 파싱 중 오류가 발생했습니다',
        response.status,
        response
      );
    }
  }

  async request<T>(
    endpoint: string,
    config: HttpRequestConfig = {}
  ): Promise<T> {
    const maxRetries = config.retries ?? MAX_RETRIES;
    const timeout = config.timeout ?? TIMEOUT_DURATION;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const method = (config.method || 'GET') as HttpMethod;
        const headers = this.getHeaders(config.headers);
        const options: RequestInit = {
          method,
          headers,
          signal: controller.signal,
          credentials: 'include',
        };

        if (config.body !== undefined) {
          // 바디가 있는 경우에만 JSON 컨텐트 타입을 명시
          headers['Content-Type'] = headers['Content-Type'] || 'application/json';
          options.body = JSON.stringify(config.body);
        }

        // 환경별 URL 처리
        const url = this.createUrl(endpoint, config.params);
        const response = await fetch(url, options);

        clearTimeout(timeoutId);

        return await this.handleResponse<T>(response);
      } catch (error) {
        clearTimeout(timeoutId);

        const processedError = this.processError(error);
        lastError = processedError;

        // 재시도 로직
        if (shouldRetry(processedError, attempt, maxRetries)) {
          console.warn(
            `HTTP 요청 실패, 재시도 중... (${attempt + 1}/${maxRetries})`,
            {
              endpoint,
              error: processedError.message,
            }
          );
          await delay(RETRY_DELAY * Math.pow(2, attempt)); // 지수 백오프
          continue;
        }

        throw processedError;
      }
    }

    throw lastError!;
  }

  private processError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new TimeoutError();
      }
      if (error instanceof HttpError) {
        return error;
      }
      return new NetworkError('네트워크 오류가 발생했습니다', error);
    }

    return new NetworkError('알 수 없는 오류가 발생했습니다');
  }

  // 편의 메서드들
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    config?: Omit<HttpRequestConfig, 'method' | 'body' | 'params'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET', params });
  }

  async post<T>(
    endpoint: string,
    body?: RequestBody,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(
    endpoint: string,
    body?: RequestBody,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(
    endpoint: string,
    body?: RequestBody,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(
    endpoint: string,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const httpService = new HttpService();

// 기존 httpClient와의 호환성을 위한 별칭
export const httpClient = httpService;
