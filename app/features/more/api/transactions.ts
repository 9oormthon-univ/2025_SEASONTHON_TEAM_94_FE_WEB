// features/more/api/transactions.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';
import type { Transaction } from '@/shared/types/expense';

export type TxType = 'OVER_EXPENSE' | 'FIXED_EXPENSE' | 'NONE';

export async function listTransactions(type?: TxType, signal?: AbortSignal) {
  return httpClient.get<ApiResponse<Transaction[]>>(
    API_ENDPOINTS.TRANSACTIONS,
    type ? { type } : {}
  );
}

export async function listTransactionsByType(
  type: TxType,
  signal?: AbortSignal
) {
  return httpClient.get<ApiResponse<Transaction[]>>(
    API_ENDPOINTS.TRANSACTIONS,
    { type }
  );
}
