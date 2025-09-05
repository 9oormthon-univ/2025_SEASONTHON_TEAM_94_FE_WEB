import { useMemo, useState, useCallback } from 'react';
import { useExpenses } from '@/features/expenses/hooks';
import { groupExpensesByDate } from '@/features/expenses/utils/expenseUtils';
import type { Transaction } from '@/shared/types/expense';

function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useCalendarExpenses(initialDate?: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate ?? new Date());
  const ymd = useMemo(() => toYMD(selectedDate), [selectedDate]);

  const dayQuery = useExpenses({
    type: 'OVER_EXPENSE',     
    startAt: ymd,
    endAt: ymd,
  });

  const expenses: Transaction[] = dayQuery.data || [];
  const loading = dayQuery.isLoading;
  const error = dayQuery.error;

  const groupedExpenses = useMemo(() => {
    return groupExpensesByDate(expenses);
  }, [expenses]);

  const stats = useMemo(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.price, 0);
    const totalCount = expenses.length;
    return { totalAmount, totalCount };
  }, [expenses]);

  const handleTransactionUpdate = useCallback(() => {
    dayQuery.refetch();
  }, [dayQuery]);

  return {
    selectedDate,
    ymd,                
    expenses,
    groupedExpenses,
    stats,
    loading,
    error,

    setSelectedDate,     
    handleTransactionUpdate,
  };
}
