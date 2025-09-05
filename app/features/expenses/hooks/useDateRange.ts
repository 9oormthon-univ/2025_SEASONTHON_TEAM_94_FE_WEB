import { useState, useMemo } from 'react';

/**
 * 날짜 범위 관리 훅
 * 월별 날짜 범위 계산 및 관리 기능을 제공합니다.
 */
export function useDateRange(initialMonthValue?: string) {
  // 현재 달을 기본값으로 설정
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const defaultMonthValue =
    initialMonthValue ||
    `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

  const [selectedMonthValue, setSelectedMonthValue] =
    useState(defaultMonthValue);

  // 선택된 달의 날짜 범위 계산
  const dateRange = useMemo(() => {
    const [year, month] = selectedMonthValue.split('-').map(Number);

    // 해당 월의 첫 번째 날
    const startDate = new Date(year, month - 1, 1);

    // 해당 월의 마지막 날
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = new Date(year, month - 1, lastDay);

    return {
      startAt: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
      endAt: endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
    };
  }, [selectedMonthValue]);

  // 화면 표시용 날짜 포맷 생성
  const displayDateRange = useMemo(() => {
    const [year, month] = selectedMonthValue.split('-').map(Number);
    const monthName = `${month}월`;
    const lastDay = new Date(year, month, 0).getDate();

    return `${monthName} 1일 - ${monthName} ${lastDay}일`;
  }, [selectedMonthValue]);

  return {
    selectedMonthValue,
    setSelectedMonthValue,
    dateRange,
    displayDateRange,
  };
}
