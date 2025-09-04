import { motion } from 'motion/react';
import type { Transaction } from '@/shared/types/expense';
import { formatExpenseDate } from '@/features/expenses/utils/dateUtils';

interface CategorizedExpenseItemProps {
  expense: Transaction;
  onUpdate?: () => void;
  onClick?: () => void;
}

export function CategorizedExpenseItem({
  expense,
  onUpdate,
  onClick,
}: CategorizedExpenseItemProps) {
  const bankName = (expense.title ?? '').trim() || '은행';

  return (
    <div className="flex flex-col gap-1">
      {/* Main Card */}
      <motion.div
        className="bg-white rounded-[10px] p-4 flex flex-col cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <div className="text-[12px] text-[#101010] mb-1 font-medium">
          {formatExpenseDate(expense.startedAt)}
        </div>
        <div className="text-base text-[#101010] mb-3 font-medium">
          <span className="text-black">{bankName}</span>
          <span className="text-[#bfbfbf] ml-1">에서 온 알림</span>
        </div>
        <div className="text-2xl font-medium text-black">
          - {expense.price.toLocaleString()}원
        </div>
      </motion.div>
    </div>
  );
}
