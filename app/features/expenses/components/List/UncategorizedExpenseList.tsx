import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import type { Transaction, ExpenseType } from '@/shared/types/expense';
import { formatExpenseDate } from '@/features/expenses/utils/expenseUtils';
import { useUpdateExpense } from '@/features/expenses/hooks/useExpenseMutations';

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
  const updateExpenseMutation = useUpdateExpense();

  const handleTransactionUpdate = useCallback(
    async (expenseId: number, type: ExpenseType) => {
      setRemovingIds(prev => new Set([...prev, expenseId]));

      try {
        const expense = expenses.find(e => e.id === expenseId);
        if (expense) {
          await updateExpenseMutation.mutateAsync({
            id: expenseId,
            data: {
              price: expense.price,
              title: expense.title,
              bankName: expense.bankName,
              splitCount: expense.splitCount,
              type,
              category: expense.category,
            },
          });

          // 애니메이션 완료 후 부모 컴포넌트에 알림
          setTimeout(() => {
            onTransactionUpdate?.(expenseId, type);
          }, ANIMATION_DELAY_MS);
        }
      } catch (error) {
        // 실패 시 removing 상태 제거
        setRemovingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(expenseId);
          return newSet;
        });
      }
    },
    [expenses, onTransactionUpdate, updateExpenseMutation]
  );

  // ✅ 조건부 렌더링은 hooks 이후에 배치
  if (expenses.length === 0 && emptyState) {
    return (
      <div className="py-12 text-center">
        <div className="text-4xl mb-4">{emptyState.icon}</div>
        <h3 className="text-lg font-semibold mb-2">{emptyState.title}</h3>
        <p className="text-gray-500 text-sm">{emptyState.description}</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-gray-500 text-base">미분류 항목이 없습니다.</p>
      </div>
    );
  }

  const visibleExpenses = expenses.filter(
    expense => !removingIds.has(expense.id)
  );

  return (
    <div className="space-y-6 pb-32">
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
              onUpdate={handleTransactionUpdate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface UncategorizedExpenseItemProps {
  expense: Transaction;
  onUpdate: (expenseId: number, type: ExpenseType) => void;
}

function UncategorizedExpenseItem({
  expense,
  onUpdate,
}: UncategorizedExpenseItemProps) {
  const bankName = (expense.title ?? '').trim() || '은행';

  const handleFixedExpenseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onUpdate(expense.id, 'FIXED_EXPENSE');
  };

  const handleOverExpenseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onUpdate(expense.id, 'OVER_EXPENSE');
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Main Card */}
      <div className="bg-white rounded-[10px] p-4 mb-1.5 flex flex-col">
        <div className="text-[12px] text-[#101010] mb-1 font-medium">
          {formatExpenseDate(expense.startedAt)}
        </div>
        <div className="text-base text-[#101010] mb-3 font-medium">
          <span className="text-black">{bankName}</span>
          <span className="text-[#bfbfbf] ml-1">에서 온 알림</span>
        </div>
        <div className={`text-2xl font-medium 'text-black'}`}>
          - {expense.price.toLocaleString()}원
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-1.5">
        <Button
          variant="outline"
          onClick={handleFixedExpenseClick}
          className="flex-1 h-[45px] border-main-orange text-main-orange bg-white rounded-[10px] text-[16px] font-bold hover:bg-main-orange/5 transition-colors duration-200"
        >
          고정지출
        </Button>

        <Button
          onClick={handleOverExpenseClick}
          className="flex-1 h-[45px] bg-main-orange text-[#fffefb] rounded-[10px] text-[16px] font-bold hover:bg-main-orange/90 transition-colors duration-200"
        >
          초과지출
        </Button>
      </div>
    </div>
  );
}
