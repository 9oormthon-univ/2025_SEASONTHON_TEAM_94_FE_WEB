import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useFixedExpenses } from '@/features/expenses/hooks/useFixedExpenses';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import { FixedExpenseStats } from '@/features/expenses/components/FixedExpenseStats';
import { FixedExpenseItem } from '@/features/expenses/components/List/FixedExpenseItem';
import ChevronDown from '@/assets/Chevron_down.svg?react';
import PlusIcon from '@/assets/plus.svg?react';
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
import { formatDateHeader } from '@/features/expenses';
import emptyImage from '@/assets/empty.png';

export function ExpenseFixedPage() {
  const navigate = useNavigate();

  // 고정 지출 관련 데이터와 로직
  const {
    groupedExpenses,
    stats,
    loading,
    error,
    displayDateRange,
    isMonthPickerOpen,
    tempMonthValue,
    monthOptions,
    handleTransactionUpdate,
    handleMonthConfirm,
    handleDateFilterClick,
    handleModalCancel,
    handleTempMonthChange,
  } = useFixedExpenses();

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
            onClick={handleTransactionUpdate}
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
      <ExpenseHeader title="고정지출 내역" />

      {/* Date Filter */}
      <div className="bg-white pt-2">
        <button
          onClick={handleDateFilterClick}
          className="flex items-center gap-1 px-5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="text-[#bfbfbf] text-[14px] font-medium">
            {displayDateRange}
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* 통계 섹션 */}
      <FixedExpenseStats
        totalCount={stats.totalCount}
        totalAmount={stats.totalAmount}
      />

      {/* Content Area */}
      <div className="px-5 py-6">
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
            {groupedExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="mb-4 flex justify-center">
                  <img
                    src={emptyImage}
                    alt="빈 상태"
                    className="w-[150px] h-[150px] object-contain"
                  />
                </div>
                <h3 className="text-center justify-start text-xl font-bold mb-1">
                  아직 고정 지출이 없어요
                </h3>
                <p className="text-center justify-start text-xs font-normal">
                  이 기간에는 고정 지출이 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-6 pb-32">
                {groupedExpenses.map(({ date, expenses }) => (
                  <div key={date}>
                    {/* 날짜 헤더 */}
                    <div className="justify-start text-sub-gray text-sm font-medium mb-2">
                      {formatDateHeader(date)}
                    </div>

                    {/* 해당 날짜의 지출 목록 */}
                    <div className="space-y-3">
                      {expenses.map(expense => (
                        <FixedExpenseItem
                          key={expense.id}
                          expense={expense}
                          onUpdate={handleTransactionUpdate}
                          onClick={() => navigate(`/expenses/${expense.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => navigate('/expenses/add')}
        className="fixed bottom-6 right-6 w-10 h-10 bg-main-orange rounded-full shadow-lg hover:bg-main-orange/90 transition-colors flex items-center justify-center z-50"
      >
        <PlusIcon className="w-6 h-6 text-white" />
      </button>

      {/* 달 선택 모달 */}
      <Dialog
        open={isMonthPickerOpen}
        onOpenChange={open => {
          if (!open) {
            handleModalCancel();
          }
        }}
      >
        <DialogContent
          className="sm:max-w-xs w-full max-w-[300px]"
          showCloseButton={false}
        >
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
