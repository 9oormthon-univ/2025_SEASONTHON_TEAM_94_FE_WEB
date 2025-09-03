import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
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
      userUid: '',
      app: '',
      category: undefined,
      type: EXPENSE_TYPES.OVER_EXPENSE,
      dutchPayCount: 1,
      ...defaultValues,
      selectedDate: defaultSelectedDate,
    },
  });

  const watchedValues = form.watch();
  const { dutchPayCount, price, title } = watchedValues;

  const [dutchInput, setDutchInput] = useState<string>(() => String(dutchPayCount ?? 1));

  useEffect(() => {
    const next = String(dutchPayCount ?? 1);
    if (next !== dutchPayHandlers.input) dutchPayHandlers.setInput(next);
  }, [dutchPayCount]);

  const isFormValid = price > 0 && title.trim().length > 0;

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  const calendarHandlers = {
    isOpen: isCalendarOpen,
    setIsOpen: setIsCalendarOpen,
  };

  const dutchPayHandlers = {
    input: dutchInput,
    setInput: setDutchInput,
  };

  return {
    form,
    watchedValues,
    isFormValid,
    calendarHandlers,
    dutchPayHandlers,
  };
}
