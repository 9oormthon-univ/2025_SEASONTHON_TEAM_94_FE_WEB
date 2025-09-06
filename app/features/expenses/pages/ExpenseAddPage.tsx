import { useNavigate } from 'react-router';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Header } from '@/shared/components/Header';
import {
  EXPENSE_TYPES,
  type TransactionCreateRequest,
} from '@/shared/types/expense';
import { ExpenseForm } from '@/features/expenses/components/Form/ExpenseForm';
import { useCreateExpense } from '@/features/expenses/hooks';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';
import { toLocalISOString } from '@/shared/utils/utils';

export function ExpenseAddPage() {
  const navigate = useNavigate();
  const createExpenseMutation = useCreateExpense();
  const [isFormValid, setIsFormValid] = useState(false);

  // 생성 시 고정된 시간 사용
  const defaultValues = useMemo(
    () => ({
      title: '', // 거래처 필드
      price: 0, // 금액 필드
      bankName: '', // 은행명 (선택사항)
      selectedDate: new Date(), // 지출일시
      dutchPayCount: 1, // 더치페이 인원 (기본값 1)
      splitCount: 1, // API 전송용 splitCount (dutchPayCount와 동일)
      memo: '', // 메모 (선택사항)
      type: EXPENSE_TYPES.OVER_EXPENSE,
      category: undefined, // 카테고리 (선택사항)
    }),
    []
  );

  const handleFormSubmit = async (formData: ExpenseFormData) => {
    try {
      const transactionData: TransactionCreateRequest = {
        price: formData.price, // 금액
        startAt: toLocalISOString(formData.selectedDate), // 지출일시 -> startAt
        title: formData.title, // 거래처 -> title
        bankName: formData.bankName || '', // 은행명 (선택사항)
        splitCount: formData.splitCount || formData.dutchPayCount, // 더치페이 -> splitCount
        type: formData.type, // 지출 유형
        category: formData.category, // 카테고리 (선택사항)
        memo: formData.memo, // 메모 (선택사항)
      };

      await createExpenseMutation.mutateAsync(transactionData);

      // 성공 시 지출 유형에 따라 적절한 페이지로 이동
      if (formData.type === EXPENSE_TYPES.OVER_EXPENSE) {
        navigate('/expenses/over');
      } else if (formData.type === EXPENSE_TYPES.FIXED_EXPENSE) {
        navigate('/expenses/fixed');
      } else {
        // 기본값으로 초과지출 페이지로 이동
        navigate('/expenses/over');
      }
    } catch (error) {
      // 에러는 mutation 훅에서 toast로 처리됨
      console.error('지출 생성 실패:', error);
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
      <Header title="지출 추가" />

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
            disabled={createExpenseMutation.isPending || !isFormValid}
            className={`flex-1 h-[58px] text-white text-[15px] font-medium rounded-[10px] disabled:opacity-50 transition-colors ${
              isFormValid && !createExpenseMutation.isPending
                ? 'bg-main-orange '
                : 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200'
            }`}
          >
            {createExpenseMutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
