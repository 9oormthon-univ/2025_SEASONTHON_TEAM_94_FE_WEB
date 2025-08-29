// src/api/index.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const API_BASE = 'https://api.stopusing.klr.kr';

// 공통 응답 포맷: { success, status, code, message, data }
export type ApiResponse<T> = {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data?: T;
};

function qs(params?: Record<string, string | number | undefined>) {
  if (!params) return '';
  const s = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return s ? `?${s}` : '';
}

export async function request<T>(
  url: string,
  method: HttpMethod = 'GET',
  body?: unknown,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(
    url.startsWith('http') ? url : `${API_BASE}${url}`,
    {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      credentials: 'omit',
    },
  );

  // 서버가 항상 JSON을 주는 스펙이라 가정
  const json = (await res.json()) as ApiResponse<T> | T;

  // 서버가 래핑 형태(data)에 담아주면 꺼내고, 아니면 그대로 사용
  const data = (json as any)?.data ?? json;

  if (!res.ok) {
    const msg = (json as any)?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

/** 편의용 GET */
export function get<T>(path: string, params?: Record<string, any>, signal?: AbortSignal) {
  return request<T>(`${path}${qs(params)}`, 'GET', undefined, signal);
}
