// features/calendar/api/transactions.ts
import { httpClient } from '@/shared/utils/httpClient';
import type { Transaction } from '@/shared/types/expense';

// 공용으로 쓰는 ApiList<T> 타입이 이미 있다면 그걸 import 해도 됨
type ApiList<T> = { data: T };

export async function fetchTransactionsByDate(ymd: string): Promise<Transaction[]> {
  // httpClient.get<T>(url, params)
  const res = await httpClient.get<ApiList<Transaction[]>>(
    '/api/v1/transactions',
    {
      // 백엔드 파라미터 이름에 맞춰주세요 (startAt/endAt 또는 startDate/endDate)
      startAt: ymd,
      endAt: ymd,
      type: 'OVER_EXPENSE',
    }
  );

  return res.data ?? [];
}
