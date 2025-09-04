/**
 * 지출 관련 API 함수들
 * 백엔드 서버와 통신하여 지출 데이터를 관리합니다.
 */

import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import {
  type TransactionResponse,
  type ExpenseType,
  type TransactionCreateRequest,
  type TransactionCreateByAlertRequest,
  type TransactionUpdateRequest,
  type TransactionCategoryResponse,
  type TransactionReportResponse,
  type TransactionFilter,
} from '@/shared/types/expense';
import type { ApiResponse } from '@/shared/types/api';

/**
 * 타입별 지출 내역 조회 (Swagger 스펙: GET /api/v1/transactions)
 */
export async function fetchTransactions(
  filter: TransactionFilter
): Promise<TransactionResponse[]> {
  const response = await httpClient.get<ApiResponse<TransactionResponse[]>>(
    API_ENDPOINTS.TRANSACTIONS,
    filter
  );
  return response.data;
}

/**
 * 지출 상세 조회 (Swagger 스펙: GET /api/v1/transactions/{id})
 */
export async function fetchTransactionById(
  id: number
): Promise<TransactionResponse> {
  const response = await httpClient.get<ApiResponse<TransactionResponse>>(
    API_ENDPOINTS.TRANSACTION_BY_ID(id)
  );
  return response.data;
}

/**
 * 지출 생성 (Swagger 스펙: POST /api/v1/transactions)
 */
export async function createTransaction(
  transaction: TransactionCreateRequest
): Promise<TransactionResponse> {
  const response = await httpClient.post<ApiResponse<TransactionResponse>>(
    API_ENDPOINTS.TRANSACTIONS,
    transaction
  );
  return response.data;
}

/**
 * 알림으로 지출 생성 (Swagger 스펙: POST /api/v1/transactions/alarm)
 */
export async function createTransactionByAlert(
  transaction: TransactionCreateByAlertRequest
): Promise<TransactionResponse> {
  const response = await httpClient.post<ApiResponse<TransactionResponse>>(
    API_ENDPOINTS.TRANSACTIONS_ALARM,
    transaction
  );
  return response.data;
}

/**
 * 지출 수정 (Swagger 스펙: PUT /api/v1/transactions/{id})
 */
export async function updateTransaction(
  id: number,
  transaction: TransactionUpdateRequest
): Promise<TransactionResponse> {
  const response = await httpClient.put<ApiResponse<TransactionResponse>>(
    API_ENDPOINTS.TRANSACTION_BY_ID(id),
    transaction
  );
  return response.data;
}

/**
 * 지출 삭제 (Swagger 스펙: DELETE /api/v1/transactions/{id})
 */
export async function deleteTransaction(
  id: number
): Promise<void> {
  await httpClient.delete<ApiResponse<TransactionResponse>>(
    API_ENDPOINTS.TRANSACTION_BY_ID(id)
  );
}

/**
 * 지출 분석을 위한 조회 (Swagger 스펙: GET /api/v1/transactions/report)
 */
export async function fetchTransactionReport(
  filter: TransactionFilter
): Promise<TransactionReportResponse> {
  const response = await httpClient.get<ApiResponse<TransactionReportResponse>>(
    API_ENDPOINTS.TRANSACTIONS_REPORT,
    filter
  );
  return response.data;
}

/**
 * 카테고리 목록 조회 (Swagger 스펙: GET /api/v1/transactions/categories)
 */
export async function fetchCategories(): Promise<
  TransactionCategoryResponse[]
> {
  const response = await httpClient.get<
    ApiResponse<TransactionCategoryResponse[]>
  >(API_ENDPOINTS.CATEGORIES);
  return response.data;
}



// 호환성을 위한 타입별 총 금액 조회 함수 (Report API 사용)
export async function fetchTotalPriceByType(
  type: ExpenseType,
  startAt?: string,
  endAt?: string
): Promise<number> {
  const reportData = await fetchTransactionReport({
    type,
    startAt,
    endAt,
  });
  return reportData.totalPrice;
}
