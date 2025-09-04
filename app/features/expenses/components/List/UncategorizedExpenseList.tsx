import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import type { Transaction, ExpenseType } from '@/shared/types/expense';
import { useUpdateExpense } from '@/features/expenses/hooks/useExpenseMutations';
import { UncategorizedExpenseItem } from '@/features/expenses/components/List/UncategorizedExpenseItem';
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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const updateExpenseMutation = useUpdateExpense();

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
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(expenseId);
        } else {
          newSet.delete(expenseId);
        }
        return newSet;
      });
    },
    []
  );

  // 일괄 수정 핸들러
  const handleBulkUpdate = useCallback(
    async (type: ExpenseType) => {
      if (selectedIds.size === 0) return;

      const selectedExpenses = expenses.filter(expense =>
        selectedIds.has(expense.id)
      );

      try {
        // 모든 선택된 항목을 병렬로 업데이트
        await Promise.all(
          selectedExpenses.map(expense =>
            updateExpenseMutation.mutateAsync({
              id: expense.id,
              data: {
                price: expense.price,
                title: expense.title,
                bankName: expense.bankName,
                splitCount: expense.splitCount,
                type,
                category: expense.category,
              },
            })
          )
        );

        // 성공 시 선택 상태 초기화 및 부모 컴포넌트에 알림
        setSelectedIds(new Set());
        selectedExpenses.forEach(expense => {
          onTransactionUpdate?.(expense.id, type);
        });
      } catch (error) {
        console.error('일괄 수정 실패:', error);
      }
    },
    [selectedIds, expenses, updateExpenseMutation, onTransactionUpdate]
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

      {/* 하단 고정 버튼 - 선택된 항목이 있을 때만 표시 */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-4 z-50"
          >
            <div className="flex gap-3">
              {/* 고정지출 버튼 */}
              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  onClick={() => handleBulkUpdate('FIXED_EXPENSE')}
                  disabled={updateExpenseMutation.isPending}
                  className="w-full h-[52px] text-base font-bold text-main-orange border-main-orange hover:bg-orange-50 transition-colors rounded-[10px]"
                >
                  고정지출
                </Button>
              </motion.div>

              {/* 초과지출 버튼 */}
              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="flex-1"
              >
                <Button
                  onClick={() => handleBulkUpdate('OVER_EXPENSE')}
                  disabled={updateExpenseMutation.isPending}
                  className={`w-full h-[52px] text-white text-base font-bold rounded-[10px] transition-colors ${
                    updateExpenseMutation.isPending
                      ? 'bg-[#EDEDED] text-gray-400 cursor-not-allowed'
                      : 'bg-main-orange hover:bg-main-orange/90'
                  }`}
                >
                  {updateExpenseMutation.isPending ? '처리 중...' : '초과지출'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
