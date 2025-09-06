import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';

type CalendarTotalsResponse = {
  data?: {
    totals?: Record<string, number>; 
  };
};

export async function fetchCalendarTotals(dateYmd: string): Promise<Record<string, number>> {
  const res = await httpClient.get<CalendarTotalsResponse>(
    API_ENDPOINTS.TRANSACTIONS_CALENDAR,
    {
      type: 'OVER_EXPENSE',
      date: dateYmd,
    }
  );
  return res.data?.totals ?? {};
}
