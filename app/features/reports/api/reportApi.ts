// features/reports/api/reportApi.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS, MOCK_USER_UID } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';
import type { Transaction } from '@/shared/types/expense';

/** 내부: 트랜잭션 배열을 안전하게 가져오고, 실패 시 [] 반환 */
async function fetchTxArray(params: Record<string, any>) {
  try {
    const res = await httpClient.get<ApiResponse<Transaction[]>>(
      API_ENDPOINTS.TRANSACTIONS,
      params
    );
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    return [];
  }
}

/** over/fixed 각각 조회하되, 하나라도 비면 all을 불러 폴백 */
export async function fetchOverAndFixed() {
  let [over, fixed] = await Promise.all([
    fetchTxArray({ type: 'OVER_EXPENSE' }),
    fetchTxArray({ type: 'FIXED_EXPENSE' }),
  ]);

  // userUid는 더 이상 필요하지 않으므로 제거
  if (over.length === 0 || fixed.length === 0) {
    // 전체 조회는 NONE 타입으로 대체하거나 둘을 합쳐서 처리
    const allOver = await fetchTxArray({ type: 'OVER_EXPENSE' });
    const allFixed = await fetchTxArray({ type: 'FIXED_EXPENSE' });
    if (over.length === 0) over = allOver;
    if (fixed.length === 0) fixed = allFixed;
  }

  return { over, fixed };
}
