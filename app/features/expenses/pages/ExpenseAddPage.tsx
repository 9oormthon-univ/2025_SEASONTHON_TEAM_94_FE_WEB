import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import {
  EXPENSE_TYPES,
  type TransactionCreateRequest,
} from '@/shared/types/expense';
import { MOCK_USER_UID } from '@/shared/config/api';
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm';
import { useExpenses } from '@/features/expenses/hooks/useExpenses';
import type { ExpenseFormData } from '@/features/expenses/utils/validation';
import { toLocalISOString } from '@/shared/utils/utils';

export function ExpenseAddPage() {
  const navigate = useNavigate();
  const { createExpense } = useExpenses();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // 생성 시 고정된 시간 사용
  const defaultValues = useMemo(() => ({
    userUid: MOCK_USER_UID,
    selectedDate: new Date(),
    dutchPayCount: 1, // 기본값 1로 수정
    app: '',
    type: EXPENSE_TYPES.OVER_EXPENSE,
    category: undefined, // 카테고리는 나중에 추가 예정
  }), []);

  const handleFormSubmit = async (formData: ExpenseFormData) => {
    setIsLoading(true);
    try {
      // 더치페이 적용된 실제 금액 계산
      const finalAmount =
        formData.dutchPayCount > 1
          ? Math.floor(formData.price / formData.dutchPayCount)
          : formData.price;

      const transactionData: TransactionCreateRequest = {
        price: finalAmount,
        startAt: toLocalISOString(formData.selectedDate),
        title: formData.title,
        userUid: formData.userUid,
        type: formData.type, // 폼에서 선택된 지출 유형 사용
        category: formData.category, // 폼에서 선택된 카테고리 (있다면)
      };

      await createExpense(transactionData);

      // 성공 시 지출 목록으로 이동
      navigate('/expenses');
    } catch (error) {
      alert('지출 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white min-h-screen max-w-md mx-2 relative flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6">
        <div
          onClick={() => navigate('/expenses')}
          className="cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </div>
        <h1 className="text-[15px] font-medium text-black tracking-[-0.165px]">
          지출 추가
        </h1>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Form */}
      <div className="flex-1">
        <ExpenseForm
          onSubmit={handleFormSubmit}
          onValidationChange={setIsFormValid}
          defaultValues={defaultValues}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 py-4 mt-auto mb-16">
        <div className="flex">
          <Button
            form="expense-form"
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`flex-1 h-[45px] text-white text-[15px] font-medium rounded-[10px] hover:bg-[#002b5b]/90 disabled:opacity-50 transition-colors ${
              isFormValid && !isLoading
                ? 'bg-[#002b5b]'
                : 'bg-[#EDEDED] text-gray-400 cursor-not-allowed hover:bg-[#EDEDED]'
            }`}
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
