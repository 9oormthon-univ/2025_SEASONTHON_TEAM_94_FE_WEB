import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { EXPENSE_TYPES } from '@/shared/types/expense';
import { expenseFormSchema, type ExpenseFormData } from '@/features/expenses/_lib/validation';

interface UseExpenseFormOptions {
  defaultValues?: Partial<ExpenseFormData>;
  onValidationChange?: (isValid: boolean) => void;
}

export function useExpenseForm({ defaultValues, onValidationChange }: UseExpenseFormOptions = {}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const defaultSelectedDate = useMemo(() => {
    return defaultValues?.selectedDate || new Date();
  }, [defaultValues?.selectedDate]);
  
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      price: 0,
      title: '',
      bankName: '',
      memo: '',
      category: undefined,
      type: EXPENSE_TYPES.OVER_EXPENSE,
      dutchPayCount: 1,
      splitCount: 1, // dutchPayCount와 동일한 값
      ...defaultValues,
      selectedDate: defaultSelectedDate,
    },
  });

  const watchedValues = form.watch();
  const { dutchPayCount, price, title, selectedDate } = watchedValues;

  const [dutchInput, setDutchInput] = useState<string>(() => String(dutchPayCount ?? 1));

  useEffect(() => {
    const next = String(dutchPayCount ?? 1);
    if (next !== dutchInput) {
      setDutchInput(next);
    }
  }, [dutchPayCount, dutchInput]);

  // 필수 필드 기반 유효성 검사: 금액, 거래처, 지출일시, 더치페이
  const isFormValid = useMemo(() => {
    return price > 0 && 
           title.trim().length > 0 && 
           selectedDate instanceof Date && 
           dutchPayCount >= 1;
  }, [price, title, selectedDate, dutchPayCount]);

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  const calendarHandlers = useMemo(() => ({
    isOpen: isCalendarOpen,
    setIsOpen: setIsCalendarOpen,
  }), [isCalendarOpen]);

  const dutchPayHandlers = useMemo(() => ({
    input: dutchInput,
    setInput: setDutchInput,
  }), [dutchInput]);

  return {
    form,
    watchedValues,
    isFormValid,
    calendarHandlers,
    dutchPayHandlers,
  };
}
