import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
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

export function ExpenseAddPage() {
  const navigate = useNavigate();
  const { createExpense } = useExpenses();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: ExpenseFormData) => {
    setIsLoading(true);
    try {
      console.log('🔍 [ExpenseAddPage] 받은 폼 데이터:', formData);
      console.log('🔍 [ExpenseAddPage] 받은 폼 데이터의 type:', formData.type);

      // 더치페이 적용된 실제 금액 계산
      const finalAmount =
        formData.dutchPayCount > 1
          ? Math.floor(formData.price / formData.dutchPayCount)
          : formData.price;

      const transactionData: TransactionCreateRequest = {
        price: finalAmount,
        startAt: formData.selectedDate.toISOString(),
        title: formData.title,
        userUid: formData.userUid,
        type: formData.type, // 폼에서 선택된 지출 유형 사용
        category: formData.category, // 폼에서 선택된 카테고리 (있다면)
      };

      console.log('🔍 [ExpenseAddPage] API 전송 데이터:', transactionData);
      console.log('🔍 [ExpenseAddPage] API 전송 데이터의 type:', transactionData.type);

      await createExpense(transactionData);

      console.log('🔍 [ExpenseAddPage] createExpense 성공');

      // 성공 시 지출 목록으로 이동
      navigate('/expenses');
    } catch (error) {
      console.error('❌ [ExpenseAddPage] 지출 저장 실패:', error);
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
      className="bg-white min-h-screen max-w-md mx-2 relative pb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div
          onClick={() => navigate('/expenses')}
          className="p-0 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </div>
        <h1 className="text-[15px] font-medium text-black tracking-[-0.165px]">
          지출 추가
        </h1>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Form */}
      <ExpenseForm
        onSubmit={handleFormSubmit}
        defaultValues={{
          price: 0,
          title: '',
          userUid: MOCK_USER_UID,
          selectedDate: new Date(),
          dutchPayCount: 0,
          app: '',
          type: EXPENSE_TYPES.OVER_EXPENSE,
          category: undefined, // 카테고리는 나중에 추가 예정
        }}
      />

      {/* Action Buttons */}
      <div className="fixed bottom-16 left-0 right-0 px-4 sm:px-6 max-w-md mx-auto">
        <div className="flex">
          <Button
            form="expense-form"
            type="submit"
            disabled={isLoading}
            className="flex-1 h-[45px] bg-[#002b5b] text-white text-[15px] font-medium rounded-[10px] hover:bg-[#002b5b]/90 disabled:opacity-50"
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
