import { useMemo, useState, useCallback } from 'react';
import { useExpenses } from '@/features/expenses/hooks';
import { groupExpensesByDate } from '@/features/expenses/utils/expenseUtils';
import type { Transaction } from '@/shared/types/expense';

/** YYYY-MM-DD */
function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 선택한 날짜의 지출만 불러오는 훅 */
export function useCalendarExpenses(initialDate?: Date) {
  // 달력에서 고른 날짜 상태
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate ?? new Date());
  const ymd = useMemo(() => toYMD(selectedDate), [selectedDate]);

  // 하루치만 조회 (startAt == endAt == 선택 날짜)
  const dayQuery = useExpenses({
    type: 'OVER_EXPENSE',          // 전체 지출이면 'NONE' 또는 백엔드 요구 타입으로 변경
    startAt: ymd,
    endAt: ymd,
  });

  const expenses: Transaction[] = dayQuery.data || [];
  const loading = dayQuery.isLoading;
  const error = dayQuery.error;

  // (그대로 재사용 가능) 날짜별 그룹 – 하루 조회라 한 그룹만 생김
  const groupedExpenses = useMemo(() => {
    return groupExpensesByDate(expenses);
  }, [expenses]);

  // 통계(갯수/합계)
  const stats = useMemo(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.price, 0);
    const totalCount = expenses.length;
    return { totalAmount, totalCount };
  }, [expenses]);

  // 상세에서 수정/삭제 후 새로고침 등에 사용
  const handleTransactionUpdate = useCallback(() => {
    dayQuery.refetch();
  }, [dayQuery]);

  return {
    // 상태/값
    selectedDate,
    ymd,                 // 'YYYY-MM-DD' (헤더/요청 파라미터로 사용)
    expenses,
    groupedExpenses,
    stats,
    loading,
    error,

    // 액션
    setSelectedDate,     // 달력 onSelect로 이걸 호출
    handleTransactionUpdate,
  };
}
