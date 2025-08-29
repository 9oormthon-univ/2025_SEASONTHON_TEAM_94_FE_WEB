import type {
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionFilter,
  ExpenseType,
} from '@/shared/types/expense';

// Context 타입 정의
export interface ExpenseContextType {
  expenses: Transaction[];
  loading: boolean;
  error: string | null;
  refreshExpenses: (filter?: Partial<TransactionFilter>) => Promise<void>;
  updateExpense: (
    userUid: string,
    id: number,
    updatedExpense: TransactionUpdateRequest
  ) => Promise<void>;
  createExpense: (newExpense: TransactionCreateRequest) => Promise<void>;
  deleteExpense: (userUid: string, id: number) => Promise<void>;
}

// Provider Props 타입 정의
export interface ExpenseProviderProps {
  children: React.ReactNode;
  initialExpenses?: Transaction[];
  userUid?: string;
  defaultType?: ExpenseType;
}
