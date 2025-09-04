import { useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useExpenses } from '@/features/expenses/hooks';
import { UncategorizedExpenseList } from '@/features/expenses/components/List/UncategorizedExpenseList';
import ChevronDown from '@/assets/Chevron_down.svg?react';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import {
  WheelPicker,
  WheelPickerWrapper,
  type WheelPickerOption,
} from '@/shared/components/wheel-picker';

// 달 옵션 생성 (1월부터 12월 순서)
const generateMonthOptions = (): WheelPickerOption[] => {
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
};

// 화면 표시용 날짜 포맷 생성 함수
const getDisplayDateRange = (monthValue: string): string => {
  const [year, month] = monthValue.split('-').map(Number);
  const monthName = `${month}월`;
  const lastDay = new Date(year, month, 0).getDate();

  return `${monthName} 1일 - ${monthName} ${lastDay}일`;
};

const MONTH_OPTIONS = generateMonthOptions();

export function ExpenseUnclassifiedPage() {
  // 현재 달을 기본값으로 설정
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentMonthValue = `${currentYear}-${currentMonth
    .toString()
    .padStart(2, '0')}`;
  const currentMonthLabel = getDisplayDateRange(currentMonthValue);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthLabel);
  const [selectedMonthValue, setSelectedMonthValue] =
    useState(currentMonthValue);
  const [tempMonthValue, setTempMonthValue] = useState(currentMonthValue); // 임시 선택값
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const navigate = useNavigate();

  // 선택된 달의 날짜 범위 계산
  const getDateRange = (monthValue: string) => {
    const [year, month] = monthValue.split('-').map(Number);

    // 해당 월의 첫 번째 날
    const startDate = new Date(year, month - 1, 1);

    // 해당 월의 마지막 날
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = new Date(year, month - 1, lastDay);

    return {
      startAt: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
      endAt: endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
    };
  };

  // 미분류 지출 데이터 가져오기 (날짜 필터 적용)
  const dateRange = getDateRange(selectedMonthValue);
  const uncategorizedQuery = useExpenses({
    type: 'NONE',
    startAt: dateRange.startAt,
    endAt: dateRange.endAt,
  });
  const expenses = uncategorizedQuery.data || [];
  const loading = uncategorizedQuery.isLoading;
  const error = uncategorizedQuery.error;

  // 트랜잭션 업데이트 핸들러
  const handleTransactionUpdateWithParams = (id: number) => {
    uncategorizedQuery.refetch();
  };

  // 달 선택 핸들러 (확인 버튼 클릭 시)
  const handleMonthSelect = () => {
    setSelectedMonth(getDisplayDateRange(tempMonthValue)); // 화면 표시용 포맷으로 설정
    setSelectedMonthValue(tempMonthValue);
    setIsMonthPickerOpen(false);
    // 선택된 달에 따른 데이터는 useExpenses 훅에서 자동으로 갱신됩니다
  };

  // 임시 달 선택 핸들러 (wheel-picker에서 값 변경 시)
  const handleTempMonthChange = (monthValue: string) => {
    setTempMonthValue(monthValue);
  };

  // 달 선택 모달 열기
  const handleDateFilterClick = () => {
    setTempMonthValue(selectedMonthValue); // 현재 선택된 값으로 초기화
    setIsMonthPickerOpen(true);
  };

  // 모달 취소 핸들러
  const handleModalCancel = () => {
    setTempMonthValue(selectedMonthValue); // 원래 값으로 되돌리기
    setIsMonthPickerOpen(false);
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error
              ? error.message
              : '데이터를 불러오는데 실패했습니다.'}
          </p>
          <button
            onClick={() => uncategorizedQuery.refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F5F9] relative w-full max-w-md mx-auto min-h-screen">
      {/* Header */}
      <ExpenseHeader title="미분류된 지출" />

      {/* Date Filter */}
      <button
        onClick={handleDateFilterClick}
        className="flex items-center gap-1 px-[19px] mt-4 hover:bg-gray-100 rounded-lg py-2 transition-colors"
      >
        <div className="text-[#bfbfbf] text-[14px] font-medium">
          {selectedMonth}
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Content Area */}
      <div className="px-[18px] mt-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-main-orange"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            <UncategorizedExpenseList
              expenses={expenses}
              onTransactionUpdate={handleTransactionUpdateWithParams}
            />
          </motion.div>
        )}
      </div>

      {/* 달 선택 모달 */}
      <Dialog
        open={isMonthPickerOpen}
        onOpenChange={open => {
          if (!open) {
            handleModalCancel();
          }
        }}
      >
        <DialogContent className="sm:max-w-xs w-full max-w-[300px]">
          <DialogHeader>
            <DialogTitle className="text-center justify-center text-2xl font-bold">
              기간 선택
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <WheelPickerWrapper>
              <WheelPicker
                options={MONTH_OPTIONS}
                value={tempMonthValue}
                onValueChange={handleTempMonthChange}
              />
            </WheelPickerWrapper>
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1 bg-main-orange hover:bg-main-orange/90 text-white"
                onClick={handleMonthSelect}
              >
                확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
