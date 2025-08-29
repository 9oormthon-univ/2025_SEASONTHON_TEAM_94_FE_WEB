import type { ExpenseType } from '@/shared/types/expense';

// ExpenseForm 관련 타입 (기존 - legacy)
export interface LegacyExpenseFormData {
  amount: string;
  merchant: string;
  app: string;
  selectedDate: Date;
  dutchPayCount: number;
}

export interface ExpenseFormProps {
  formData: LegacyExpenseFormData;
  onFormDataChange: (data: Partial<LegacyExpenseFormData>) => void;
  isDatePickerOpen: boolean;
  onDatePickerOpenChange: (open: boolean) => void;
}

// react-hook-form용 새로운 Props 타입
export interface ExpenseHookFormProps {
  // react-hook-form props는 내부에서 useForm으로 관리
}
