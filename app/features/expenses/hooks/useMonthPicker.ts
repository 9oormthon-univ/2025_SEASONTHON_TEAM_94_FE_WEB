import { useState, useMemo } from 'react';
import type { WheelPickerOption } from '@/shared/components/wheel-picker';

/**
 * 월 선택기 관리 훅
 * WheelPicker를 사용한 월 선택 기능을 제공합니다.
 */
export function useMonthPicker(initialMonthValue?: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMonthValue, setTempMonthValue] = useState(initialMonthValue || '');

  // 달 옵션 생성 (1월부터 12월 순서)
  const monthOptions = useMemo((): WheelPickerOption[] => {
    const options: WheelPickerOption[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // 1월부터 12월까지 순서대로 생성
    for (let month = 1; month <= 12; month++) {
      const monthName = `${month}월`;

      options.push({
        label: monthName, // wheel-picker에서는 "1월", "2월" 형식
        value: `${currentYear}-${month.toString().padStart(2, '0')}`,
      });
    }

    return options;
  }, []);

  // 달 선택 핸들러 (확인 버튼 클릭 시)
  const handleMonthSelect = (onConfirm: (monthValue: string) => void) => {
    onConfirm(tempMonthValue);
    setIsOpen(false);
  };

  // 임시 달 선택 핸들러 (wheel-picker에서 값 변경 시)
  const handleTempMonthChange = (monthValue: string) => {
    setTempMonthValue(monthValue);
  };

  // 달 선택 모달 열기
  const openMonthPicker = (currentMonthValue: string) => {
    setTempMonthValue(currentMonthValue); // 현재 선택된 값으로 초기화
    setIsOpen(true);
  };

  // 모달 취소 핸들러
  const closeMonthPicker = (currentMonthValue: string) => {
    setTempMonthValue(currentMonthValue); // 원래 값으로 되돌리기
    setIsOpen(false);
  };

  return {
    isOpen,
    tempMonthValue,
    monthOptions,
    handleMonthSelect,
    handleTempMonthChange,
    openMonthPicker,
    closeMonthPicker,
  };
}
