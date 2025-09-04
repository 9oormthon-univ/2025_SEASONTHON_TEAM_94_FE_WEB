import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Transaction, ExpenseType } from '@/shared/types/expense';
import { useBulkUpdateExpense } from '@/features/expenses/hooks/useExpenseMutations';
import { useBulkSelection } from '@/features/expenses/hooks/useBulkSelection';
import { UncategorizedExpenseItem } from './UncategorizedExpenseItem';
import { BulkActionButtons } from './BulkActionButtons';
import emptyImage from '@/assets/empty.png';

const ANIMATION_DELAY_MS = 300;

interface UncategorizedExpenseListProps {
  expenses: Transaction[];
  emptyState?: {
    icon: string;
    title: string;
    description: string;
  };
  onTransactionUpdate?: (id: number, type: ExpenseType) => void;
}

export function UncategorizedExpenseList({
  expenses,
  emptyState,
  onTransactionUpdate,
}: UncategorizedExpenseListProps) {
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const bulkUpdateExpenseMutation = useBulkUpdateExpense();
  const {
    selectedIds,
    hasSelection,
    handleItemSelect,
    getSelectedItems,
    clearSelection,
  } = useBulkSelection<Transaction>();

  const defaultEmptyState = useMemo(
    () => ({
      icon: emptyImage,
      title: '아직 미분류된 지출이 없어요',
      description: '금융 거래는 앱 알림을 통해 자동으로 추적된답니다!',
    }),
    []
  );

  const currentEmptyState = emptyState || defaultEmptyState;
  // 체크박스 선택 핸들러
  const handleCheckboxChange = useCallback(
    (expenseId: number, checked: boolean) => {
      handleItemSelect(expenseId, checked);
    },
    [handleItemSelect]
  );

  // 일괄 수정 핸들러
  const handleBulkUpdate = useCallback(
    async (type: ExpenseType) => {
      if (!hasSelection) return;

      const selectedExpenses = getSelectedItems(expenses);

      try {
        // 일괄 업데이트 실행
        await bulkUpdateExpenseMutation.mutateAsync({
          updates: selectedExpenses.map(expense => ({
            id: expense.id,
            data: {
              price: expense.price,
              title: expense.title,
              bankName: expense.bankName,
              splitCount: expense.splitCount,
              type,
              category: expense.category,
            },
          })),
        });

        // 성공 시 선택 상태 초기화 및 부모 컴포넌트에 알림
        clearSelection();
        selectedExpenses.forEach(expense => {
          onTransactionUpdate?.(expense.id, type);
        });
      } catch (error) {
        console.error('일괄 수정 실패:', error);
      }
    },
    [
      hasSelection,
      getSelectedItems,
      expenses,
      bulkUpdateExpenseMutation,
      onTransactionUpdate,
      clearSelection,
    ]
  );

  // ✅ 조건부 렌더링은 hooks 이후에 배치
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4 flex justify-center">
          <img
            src={currentEmptyState.icon}
            alt="빈 상태"
            className="w-[150px] h-[150px] object-contain"
          />
        </div>
        <h3 className="text-center justify-start text-xl font-bold mb-1">
          {currentEmptyState.title}
        </h3>
        <p className="text-center justify-start text-xs font-normal">
          {currentEmptyState.description}
        </p>
      </div>
    );
  }

  const visibleExpenses = expenses.filter(
    expense => !removingIds.has(expense.id)
  );

  return (
    <div className="relative">
      <div className="space-y-2.5 pb-20">
        <AnimatePresence mode="popLayout">
          {visibleExpenses.map(expense => (
            <motion.div
              key={expense.id}
              layout
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                x: -100,
                transition: {
                  duration: ANIMATION_DELAY_MS / 1000,
                  ease: 'easeInOut',
                },
              }}
              transition={{
                layout: {
                  duration: ANIMATION_DELAY_MS / 1000,
                  ease: 'easeInOut',
                },
              }}
            >
              <UncategorizedExpenseItem
                expense={expense}
                isSelected={selectedIds.has(expense.id)}
                onCheckboxChange={handleCheckboxChange}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <BulkActionButtons
        hasSelection={hasSelection}
        onBulkUpdate={handleBulkUpdate}
        isLoading={bulkUpdateExpenseMutation.isPending}
      />
    </div>
  );
}
