import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  EXPENSE_TYPES,
  type TransactionCreateRequest,
  type ExpenseType,
} from '@/shared/types/expense';
import { MOCK_USER_UID } from '@/shared/config/api';
import { ExpenseTypeSelector } from '../components/ExpenseTypeSelector';
import { ExpenseForm } from '../components/ExpenseForm';
import { useExpenses } from '../hooks/useExpenses';

interface ExpenseFormData {
  amount: string;
  merchant: string;
  app: string;
  selectedDate: Date;
  dutchPayCount: number;
}

export function ExpenseAddPage() {
  const navigate = useNavigate();
  const { createExpense } = useExpenses();
  const [expenseType, setExpenseType] = useState<ExpenseType>(
    EXPENSE_TYPES.OVER_EXPENSE
  );
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    merchant: '',
    app: '',
    selectedDate: new Date(),
    dutchPayCount: 0,
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormDataChange = (data: Partial<ExpenseFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.merchant) {
      alert('금액과 거래처를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 더치페이 적용된 실제 금액 계산
      const numericAmount = parseInt(formData.amount.replace(/[^0-9]/g, '')) || 0;
      const finalAmount =
        formData.dutchPayCount > 1
          ? Math.floor(numericAmount / formData.dutchPayCount)
          : numericAmount;

      const transactionData: TransactionCreateRequest = {
        price: finalAmount,
        startAt: formData.selectedDate.toISOString(),
        title: formData.merchant,
        userUid: MOCK_USER_UID,
        type: expenseType, // 선택된 지출 유형 추가
      };

      await createExpense(transactionData);

      // 성공 시 지출 목록으로 이동
      navigate('/expenses');
    } catch (error) {
      console.error('지출 저장 실패:', error);
      alert('지출 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen max-w-md mx-2 relative pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
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

      {/* Type Selection */}
      <ExpenseTypeSelector
        expenseType={expenseType}
        onTypeChange={setExpenseType}
      />

      {/* Form */}
      <ExpenseForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        isDatePickerOpen={isDatePickerOpen}
        onDatePickerOpenChange={setIsDatePickerOpen}
      />

      {/* Action Buttons */}
      <div className="fixed bottom-16 left-0 right-0 px-4 sm:px-6 max-w-md mx-auto">
        <div className="flex">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 h-[45px] bg-[#002b5b] text-white text-[15px] font-medium rounded-[10px] hover:bg-[#002b5b]/90 disabled:opacity-50"
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
