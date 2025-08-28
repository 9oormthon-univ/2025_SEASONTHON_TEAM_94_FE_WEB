// API 응답 타입 정의 (Swagger 스펙에 맞게 수정)
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API 에러 타입
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
