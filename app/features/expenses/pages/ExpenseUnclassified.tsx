import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  useExpenses,
  useDateRange,
  useMonthPicker,
} from '@/features/expenses/hooks';
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
} from '@/shared/components/wheel-picker';

export function ExpenseUnclassifiedPage() {
  const navigate = useNavigate();

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

  // 미분류 지출 데이터 가져오기 (날짜 필터 적용)
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
          {displayDateRange}
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
                options={monthOptions}
                value={tempMonthValue}
                onValueChange={handleTempMonthChange}
              />
            </WheelPickerWrapper>
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1 bg-main-orange hover:bg-main-orange/90 text-white"
                onClick={handleMonthConfirm}
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
