// API 응답 타입 정의 (Swagger 스펙에 맞게 수정)
export interface ApiResponse<T> {
  success: boolean;
  status: number; // int32
  code: string;
  message: string;
  data: T;
}

// Swagger 스펙에 맞는 구체적인 API 응답 타입들
export interface ApiResponseUserResponse extends ApiResponse<import('./user').UserResponse> {}
export interface ApiResponseTransactionResponse extends ApiResponse<import('./expense').TransactionResponse> {}
export interface ApiResponseListTransactionResponse extends ApiResponse<import('./expense').TransactionResponse[]> {}
export interface ApiResponseTransactionReportResponse extends ApiResponse<import('./expense').TransactionReportResponse> {}
export interface ApiResponseListTransactionCategoryResponse extends ApiResponse<import('./expense').TransactionCategoryResponse[]> {}
export interface ApiResponseBudgetGoalResponse extends ApiResponse<import('./budget').BudgetGoalResponse> {}

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
