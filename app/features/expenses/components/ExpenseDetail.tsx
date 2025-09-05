import { ChevronLeft, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { ExpenseForm } from './Form/ExpenseForm';
import type { Transaction } from '@/shared/types/expense';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';

interface ExpenseDetailProps {
  expense: Transaction | null;
  onSave: (formData: ExpenseFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function ExpenseDetail({
  expense,
  onSave,
  onCancel,
  onDelete,
  isLoading = false,
}: ExpenseDetailProps) {
  if (!expense) {
    return (
      <div className="bg-white min-h-screen max-w-md mx-2 relative pb-10">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">💸</div>
            <p>지출 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // Transaction을 ExpenseFormData로 변환
  const getDefaultValues = (): Partial<ExpenseFormData> => {
    return {
      price: expense.price,
      title: expense.title,
      bankName: expense.bankName,
      selectedDate: new Date(expense.startedAt),
      type: expense.type,
      category: expense.category,
      dutchPayCount: expense.splitCount || 1,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white min-h-screen max-w-md mx-2 relative pb-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <button
          onClick={onCancel}
          className="p-1 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[15px] font-medium text-black tracking-[-0.165px]">
          지출 수정
        </h1>
        <div className="w-8 flex justify-end">
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 cursor-pointer rounded-full hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <ExpenseForm onSubmit={onSave} defaultValues={getDefaultValues()} />

      {/* Action Buttons */}
      <div className="fixed bottom-16 left-0 right-0 px-4 sm:px-6 max-w-md mx-auto">
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            className="flex-1 h-[45px] border-sub-blue text-sub-blue text-[15px] font-medium rounded-[10px] hover:bg-sub-blue/5 transition-colors"
          >
            삭제
          </Button>
          <Button
            form="expense-form"
            type="submit"
            disabled={isLoading}
            className="flex-1 h-[45px] bg-sub-blue text-white text-[15px] font-medium rounded-[10px] hover:bg-sub-blue/90 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '수정 중...' : '수정'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
