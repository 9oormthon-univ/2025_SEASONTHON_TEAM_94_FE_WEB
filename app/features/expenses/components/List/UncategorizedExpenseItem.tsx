import React, { useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import type { Transaction } from '@/shared/types/expense';
import { formatExpenseDate } from '@/features/expenses/utils/dateUtils';
import { getCategoryInfo } from '@/features/expenses/utils/categoryUtils';

interface UncategorizedExpenseItemProps {
  expense: Transaction;
  isSelected: boolean;
  onCheckboxChange: (expenseId: number, checked: boolean) => void;
}

export const UncategorizedExpenseItem =
  React.memo<UncategorizedExpenseItemProps>(
    ({ expense, isSelected, onCheckboxChange }) => {
      const handleCheckboxChange = useCallback(
        (checked: boolean) => {
          onCheckboxChange(expense.id, checked);
        },
        [expense.id, onCheckboxChange]
      );

      // 데이터에서 카테고리가 설정된 경우에만 표시
      const categoryInfo = useMemo(
        () => getCategoryInfo(expense.category),
        [expense.category]
      );

      return (
        <motion.div
          className="bg-white h-25 rounded-lg relative px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => handleCheckboxChange(!isSelected)}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="flex flex-col gap-0.5 h-full">
            {/* Date and Checkbox Row */}
            <div className="flex items-end justify-between h-[18px]">
              <div className="text-sub-gray justify-start text-sub-Color text-xs font-medium">
                {formatExpenseDate(expense.startedAt)}
              </div>
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleCheckboxChange}
                className="w-[18px] h-[18px] border-sub-gray data-[state=checked]:bg-main-orange data-[state=checked]:border-main-orange pointer-events-none"
              />
            </div>

            {/* Merchant Name */}
            <div className="text-black justify-start text-base">
              {expense.title}
            </div>

            {/* Amount and Category Row */}
            <div className="flex items-end justify-between">
              <div className="justify-start text-black text-xl font-bold">
                -{expense.price.toLocaleString()}원
              </div>

              {/* Category Badge - 데이터에 카테고리가 있을 때만 표시 */}
              {categoryInfo && (
                <Badge
                  variant="outline"
                  className="rounded-[100px] px-3 py-1 flex items-center gap-1.5 border-main-orange text-main-orange"
                >
                  <img
                    src={categoryInfo.icon}
                    alt={categoryInfo.label}
                    className="w-3.5 h-3.5"
                  />
                  <span className="justify-start text-xs font-medium">
                    {categoryInfo.label}
                  </span>
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      );
    }
  );
