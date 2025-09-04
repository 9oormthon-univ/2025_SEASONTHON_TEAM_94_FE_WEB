// features/reports/api/reportApi.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';
import type { TransactionReportResponse, ExpenseType } from '@/shared/types/expense';

type FetchReportArgs = {
  type: ExpenseType;       
  startAt: Date;
  endAt: Date;
  signal?: AbortSignal;
};

const toDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

export async function fetchTransactionReportByType({ type, startAt, endAt, signal }: FetchReportArgs) {
  const params = { type, startAt: toDate(startAt), endAt: toDate(endAt) };
  const res = await httpClient.get<ApiResponse<TransactionReportResponse>>(
    API_ENDPOINTS.TRANSACTIONS_REPORT,
    params,
    { ...(signal ? ({ signal } as any) : {}) }
  );
  return res.data;
}

export async function fetchMonthlyReportSum(args: Omit<FetchReportArgs, 'type'>) {
  const [over, fixed] = await Promise.all([
    fetchTransactionReportByType({ ...args, type: 'OVER_EXPENSE' }),
    fetchTransactionReportByType({ ...args, type: 'FIXED_EXPENSE' }),
  ]);

  return {
    totalPrice: (over?.totalPrice ?? 0) + (fixed?.totalPrice ?? 0),
    totalCount: (over?.totalCount ?? 0) + (fixed?.totalCount ?? 0),
    startAt: `${toDate(args.startAt)}T00:00:00`,
    endAt:   `${toDate(args.endAt)}T23:59:59`,
  } satisfies TransactionReportResponse;
}
