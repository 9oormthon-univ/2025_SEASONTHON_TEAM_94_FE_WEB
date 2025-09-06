import { useState, useRef } from 'react';
import { formatAmount } from '@/features/onboarding/utils/amountUtils';

/**
 * 예산 목표 폼 상태와 입력 처리를 관리하는 훅
 */
export function useBudgetGoalForm() {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const inputValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    // 숫자만 추출 (콤마, 원, 기타 문자 제거)
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    
    // 최대 10자리로 제한
    const limitedValue = numericValue.slice(0, 10);
    
    setBudgetAmount(limitedValue);
    setIsFormValid(limitedValue.length > 0);

    // 커서 위치 복원
    setTimeout(() => {
      if (inputRef.current) {
        const newFormattedValue = limitedValue ? formatAmount(limitedValue) : '';
        // "원" 바로 앞 위치로 커서 설정
        const newCursorPosition = newFormattedValue.length - 1;
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const value = input.value;

    // 숫자 입력 처리
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      const newNumericValue = budgetAmount + e.key;
      if (newNumericValue.length <= 10) {
        setBudgetAmount(newNumericValue);
        setIsFormValid(newNumericValue.length > 0);
        
        setTimeout(() => {
          if (inputRef.current) {
            const newFormattedValue = formatAmount(newNumericValue);
            const newCursorPosition = newFormattedValue.length - 1;
            inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }, 0);
      }
      return;
    }

    // Backspace 처리
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (budgetAmount.length > 0) {
        const newNumericValue = budgetAmount.slice(0, -1);
        setBudgetAmount(newNumericValue);
        setIsFormValid(newNumericValue.length > 0);
        
        setTimeout(() => {
          if (inputRef.current) {
            const newFormattedValue = newNumericValue ? formatAmount(newNumericValue) : '';
            const newCursorPosition = newFormattedValue.length - 1;
            inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }, 0);
      }
      return;
    }

    // 허용된 키들
    const allowedKeys = [
      'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Tab', 'Enter', 'Home', 'End'
    ];
    
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const formattedAmount = budgetAmount ? formatAmount(budgetAmount) : '';

  return {
    budgetAmount,
    isFormValid,
    formattedAmount,
    handleInputChange,
    handleKeyDown,
    inputRef,
  };
}
