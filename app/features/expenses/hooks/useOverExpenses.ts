import { useMemo } from 'react';
import {
  useExpenses,
  useDateRange,
  useMonthPicker,
} from '@/features/expenses/hooks';
import { groupExpensesByDate } from '@/features/expenses/utils/expenseUtils';
import type { Transaction } from '@/shared/types/expense';

/**
 * 초과 지출 관련 데이터와 로직을 관리하는 훅
 */
export function useOverExpenses() {
  // 날짜 범위 관리
  const {
    selectedMonthValue,
    setSelectedMonthValue,
    dateRange,
    displayDateRange,
  } = useDateRange();

  // 월 선택기 관리
  const {
    isOpen: isMonthPickerOpen,
    tempMonthValue,
    monthOptions,
    handleMonthSelect,
    handleTempMonthChange,
    openMonthPicker,
    closeMonthPicker,
  } = useMonthPicker(selectedMonthValue);

  // 초과 지출 데이터 가져오기 (날짜 필터 적용)
  const overExpensesQuery = useExpenses({
    type: 'OVER_EXPENSE',
    startAt: dateRange.startAt,
    endAt: dateRange.endAt,
  });

  const expenses = overExpensesQuery.data || [];
  const loading = overExpensesQuery.isLoading;
  const error = overExpensesQuery.error;

  // 날짜별로 그룹화
  const groupedExpenses = useMemo(() => {
    return groupExpensesByDate(expenses);
  }, [expenses]);

  // 통계 계산
  const stats = useMemo(() => {
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.price,
      0
    );
    const totalCount = expenses.length;

    return {
      totalAmount,
      totalCount,
    };
  }, [expenses]);

  // 트랜잭션 업데이트 핸들러
  const handleTransactionUpdate = () => {
    overExpensesQuery.refetch();
  };

  // 달 선택 핸들러 (확인 버튼 클릭 시)
  const handleMonthConfirm = () => {
    setSelectedMonthValue(tempMonthValue);
    handleMonthSelect(() => {});
  };

  // 달 선택 모달 열기
  const handleDateFilterClick = () => {
    openMonthPicker(selectedMonthValue);
  };

  // 모달 취소 핸들러
  const handleModalCancel = () => {
    closeMonthPicker(selectedMonthValue);
  };

  return {
    // 데이터
    expenses,
    groupedExpenses,
    stats,
    loading,
    error,

    // 날짜 관련
    selectedMonthValue,
    displayDateRange,
    dateRange,

    // 월 선택기 관련
    isMonthPickerOpen,
    tempMonthValue,
    monthOptions,

    // 핸들러
    handleTransactionUpdate,
    handleMonthConfirm,
    handleDateFilterClick,
    handleModalCancel,
    handleTempMonthChange,
  };
}
