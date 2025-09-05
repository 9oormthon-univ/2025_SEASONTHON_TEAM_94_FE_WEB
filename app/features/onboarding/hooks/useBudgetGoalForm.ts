import { useState } from 'react';
import {
  formatAmount,
  handleNumericKeyInput,
  handleBackspaceKeyInput,
  handleFocusRestriction,
} from '@/features/onboarding/utils/amountUtils';

/**
 * 예산 목표 폼 상태와 입력 처리를 관리하는 훅
 */
export function useBudgetGoalForm() {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 숫자 입력 처리
    handleNumericKeyInput(e, budgetAmount, setBudgetAmount, setIsFormValid);

    // Backspace 입력 처리
    handleBackspaceKeyInput(e, budgetAmount, setBudgetAmount, setIsFormValid);

    // 포커스 제한 처리
    handleFocusRestriction(e);
  };

  const formattedAmount = budgetAmount ? formatAmount(budgetAmount) : '';

  return {
    budgetAmount,
    isFormValid,
    formattedAmount,
    handleKeyDown,
  };
}
