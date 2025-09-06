import { motion } from 'motion/react';
import type { Transaction } from '@/shared/types/expense';
import { getCategoryInfo } from '@/features/expenses/utils/categoryUtils';
import { calculateDisplayAmount } from '@/features/expenses/utils/calculationUtils';
import { Badge } from '@/shared/components/ui/badge';

interface FixedExpenseItemProps {
  expense: Transaction;
  onUpdate?: () => void;
  onClick?: () => void;
}

export function FixedExpenseItem({
  expense,
  onUpdate,
  onClick,
}: FixedExpenseItemProps) {
  // 데이터에서 카테고리가 설정된 경우에만 표시
  const categoryInfo = getCategoryInfo(expense.category);
  
  // 더치페이 적용된 표시 금액 계산
  const displayAmount = calculateDisplayAmount(expense.price, expense.splitCount || 1);

  return (
    <motion.div
      className="bg-white h-25 rounded-lg relative px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="flex flex-col justify-center gap-0.5 h-full">
        {/* Merchant Name */}
        <div className="text-black justify-start text-base">
          {expense.title}
        </div>

        {/* Amount and Category Row */}
        <div className="flex items-center justify-between">
          <div className="justify-start text-black text-xl font-bold">
            -{displayAmount.toLocaleString()}원
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
