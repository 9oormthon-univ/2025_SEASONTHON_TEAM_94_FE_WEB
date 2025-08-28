export const EXPENSE_CATEGORIES = {
  UNCLASSIFIED: 'unclassified',
  FIXED: 'fixed',
  ADDITIONAL: 'additional',
} as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[keyof typeof EXPENSE_CATEGORIES];

export interface Expense {
  id: string;
  place: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  sharedWith: number;
}
