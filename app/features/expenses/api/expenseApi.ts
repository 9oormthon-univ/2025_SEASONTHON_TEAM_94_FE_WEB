/**
 * 지출 관련 API 함수들
 * 백엔드 서버와 통신하여 지출 데이터를 관리합니다.
 */

import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import {
  type Transaction,
  type ExpenseType,
  type TransactionCreateRequest,
  type TransactionUpdateRequest,
  type TransactionCategoryResponse,
} from '@/shared/types/expense';
import type { ApiResponse } from '@/shared/types/api';

// 조회 필터 타입
export interface TransactionFilter {
  userUid: string;
  type?: ExpenseType;
}

/**
 * 타입별 지출 내역 조회
 */
export async function fetchTransactions(
  filter: TransactionFilter
): Promise<Transaction[]> {
  const response = await httpClient.get<ApiResponse<Transaction[]>>(
    API_ENDPOINTS.TRANSACTIONS,
    filter
  );
  return response.data;
}

/**
 * 지출 상세 조회
 */
export async function fetchTransactionById(
  userUid: string,
  id: number
): Promise<Transaction> {
  const response = await httpClient.get<ApiResponse<Transaction>>(
    API_ENDPOINTS.TRANSACTION_BY_ID(id),
    { userUid }
  );
  return response.data;
}

/**
 * 지출 생성
 */
export async function createTransaction(
  transaction: TransactionCreateRequest
): Promise<Transaction> {
  const response = await httpClient.post<ApiResponse<Transaction>>(
    API_ENDPOINTS.TRANSACTIONS,
    transaction
  );
  return response.data;
}

/**
 * 지출 수정
 */
export async function updateTransaction(
  userUid: string,
  id: number,
  transaction: TransactionUpdateRequest
): Promise<Transaction> {
  const response = await httpClient.put<ApiResponse<Transaction>>(
    `${API_ENDPOINTS.TRANSACTION_BY_ID(id)}?userUid=${userUid}`,
    transaction
  );
  return response.data;
}

/**
 * 지출 삭제
 */
export async function deleteTransaction(
  userUid: string,
  id: number
): Promise<void> {
  await httpClient.delete<ApiResponse<void>>(
    `${API_ENDPOINTS.TRANSACTION_BY_ID(id)}?userUid=${userUid}`
  );
}

/**
 * 타입별 지출 총 금액 조회
 */
export async function fetchTotalPriceByType(
  userUid: string,
  type: ExpenseType
): Promise<number> {
  const response = await httpClient.get<ApiResponse<number>>(
    API_ENDPOINTS.TOTAL_PRICE,
    { userUid, type }
  );
  return response.data;
}

/**
 * 카테고리 목록 조회
 */
export async function fetchCategories(): Promise<
  TransactionCategoryResponse[]
> {
  const response = await httpClient.get<
    ApiResponse<TransactionCategoryResponse[]>
  >(API_ENDPOINTS.CATEGORIES);
  return response.data;
}

// 기존 호환성을 위한 별칭
export const fetchAllExpenses = fetchTransactions;
export const fetchExpenseById = fetchTransactionById;
export const createExpense = createTransaction;
export const updateExpense = updateTransaction;
export const deleteExpense = deleteTransaction;
