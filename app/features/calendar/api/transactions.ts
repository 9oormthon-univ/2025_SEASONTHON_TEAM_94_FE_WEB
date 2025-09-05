// features/calendar/api/transactions.ts
import { httpClient } from '@/shared/utils/httpClient';
import type { Transaction } from '@/shared/types/expense';

type ApiList<T> = { data: T };

export async function fetchTransactionsByDate(ymd: string): Promise<Transaction[]> {
  // httpClient.get<T>(url, params)
  const res = await httpClient.get<ApiList<Transaction[]>>(
    '/api/v1/transactions',
    {
      startAt: ymd,
      endAt: ymd,
      type: 'OVER_EXPENSE',
    }
  );

  return res.data ?? [];
}
