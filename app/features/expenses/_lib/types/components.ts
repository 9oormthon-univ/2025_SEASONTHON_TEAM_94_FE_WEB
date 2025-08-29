import type { ExpenseType } from '@/shared/types/expense';

// ExpenseForm 관련 타입
export interface ExpenseFormData {
  amount: string;
  merchant: string;
  app: string;
  selectedDate: Date;
  dutchPayCount: number;
}

export interface ExpenseFormProps {
  formData: ExpenseFormData;
  onFormDataChange: (data: Partial<ExpenseFormData>) => void;
  isDatePickerOpen: boolean;
  onDatePickerOpenChange: (open: boolean) => void;
}

// ExpenseTypeSelector 관련 타입
export interface ExpenseTypeSelectorProps {
  expenseType: ExpenseType;
  onTypeChange: (type: ExpenseType) => void;
}
