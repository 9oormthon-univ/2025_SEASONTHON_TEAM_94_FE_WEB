// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
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
