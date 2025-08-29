// src/api/transactions.ts
import { get } from './index';

export type TxType = 'OVER_EXPENSE' | 'FIXED_EXPENSE' | 'NONE';

export type TransactionResponse = {
  id: number;
  price: number;
  title: string;
  type: TxType;
  userUid: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  startAt?: string;
};

export function listTransactions(userUid: string, signal?: AbortSignal) {
  return get<TransactionResponse[]>(`/api/v1/transactions`, { userUid }, signal);
}
export function listTransactionsByType(userUid: string, type: TxType, signal?: AbortSignal) {
  return get<TransactionResponse[]>(`/api/v1/transactions`, { userUid, type }, signal);
}
