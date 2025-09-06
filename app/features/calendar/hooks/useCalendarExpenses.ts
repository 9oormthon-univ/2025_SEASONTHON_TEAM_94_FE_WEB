import { useMemo, useState, useCallback } from 'react';
import { startOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useExpenses } from '@/features/expenses/hooks';
import { fetchCalendarTotals } from '@/features/calendar/api/transactions';
import type { Transaction } from '@/shared/types/expense';

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function useCalendarExpenses(initialDate?: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate ?? new Date());
  const [visibleMonth, setVisibleMonth] = useState<Date>(initialDate ?? new Date());

  const ymd = useMemo(() => toYMD(selectedDate), [selectedDate]);

  const dayQuery = useExpenses({
    type: 'OVER_EXPENSE',
    startAt: ymd,
    endAt: ymd,
  });

  const expenses: Transaction[] = dayQuery.data || [];
  const loading = dayQuery.isLoading;
  const error = dayQuery.error;

  const monthAnchor = useMemo(() => toYMD(startOfMonth(visibleMonth)), [visibleMonth]);

  const {
    data: monthTotals = {} as Record<string, number>,
    isLoading: monthTotalsLoading,
    refetch: refetchMonthTotals,
  } = useQuery<Record<string, number>>({
    queryKey: ['calendarTotals', 'OVER_EXPENSE', monthAnchor],
    queryFn: () => fetchCalendarTotals(monthAnchor),
    staleTime: 60_000,
});

  const stats = useMemo(() => {
    const totalAmount = expenses.reduce((s, e) => s + e.price, 0);
    return { totalAmount, totalCount: expenses.length };
  }, [expenses]);

  const handleTransactionUpdate = useCallback(() => {
    dayQuery.refetch();
    refetchMonthTotals();
  }, [dayQuery, refetchMonthTotals]);

  return {
    // state
    selectedDate,
    setSelectedDate,
    visibleMonth,
    setVisibleMonth,

    // data
    ymd,
    expenses,
    stats,
    loading,
    error,
    monthTotals,          
    monthTotalsLoading,

    // actions
    handleTransactionUpdate,
  };
}
