import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {
  fetchTransactions,
  updateTransaction,
  createTransaction,
  deleteTransaction,
} from '@/features/expenses/api/expenseApi';
import { MOCK_USER_UID } from '@/shared/config/api';
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  ExpenseType,
  TransactionFilter,
} from '@/shared/types/expense';
import type {
  ExpenseContextType,
  ExpenseProviderProps,
} from '@/features/expenses/_lib/types/hooks';

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function ExpenseProvider({
  children,
  initialExpenses,
  userUid = MOCK_USER_UID, // 실제로는 사용자 인증에서 가져옴
  defaultType = 'NONE' as ExpenseType, // 기본 타입 추가
}: ExpenseProviderProps) {
  const [expenses, setExpenses] = useState<Transaction[]>(
    initialExpenses || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshExpenses = useCallback(
    async (filter?: Partial<TransactionFilter>) => {
      try {
        setLoading(true);
        setError(null);
        const finalFilter: TransactionFilter = {
          userUid,
          type: defaultType,
          ...filter,
        };
        const data = await fetchTransactions(finalFilter);
        setExpenses(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '지출 데이터를 불러오는데 실패했습니다.'
        );
      } finally {
        setLoading(false);
      }
    },
    [userUid, defaultType]
  );

  const updateExpense = useCallback(
    async (
      userId: string,
      id: number,
      updatedExpense: TransactionUpdateRequest
    ) => {
      try {
        // Optimistic update
        setExpenses(prev =>
          prev.map(expense =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          )
        );

        await updateTransaction(userId, id, updatedExpense);

        // 성공 후 다시 조회
        await refreshExpenses();
      } catch (error) {
        // 에러 시 원상복구
        await refreshExpenses();
        throw error;
      }
    },
    [refreshExpenses]
  );

  const createExpense = useCallback(
    async (newExpense: TransactionCreateRequest) => {
      try {
        const createdExpense = await createTransaction(newExpense);

        // Optimistic update
        setExpenses(prev => [createdExpense, ...prev]);

        // 성공 후 다시 조회
        await refreshExpenses();
      } catch (error) {
        // 에러 시 원상복구
        await refreshExpenses();
        throw error;
      }
    },
    [refreshExpenses]
  );

  const deleteExpense = useCallback(
    async (userId: string, id: number) => {
      try {
        // Optimistic update
        setExpenses(prev => prev.filter(expense => expense.id !== id));

        await deleteTransaction(userId, id);

        // 성공 후 다시 조회
        await refreshExpenses();
      } catch (error) {
        // 에러 시 원상복구
        await refreshExpenses();
        throw error;
      }
    },
    [refreshExpenses]
  );

  // 초기 데이터가 없으면 자동으로 로드
  useEffect(() => {
    if (!initialExpenses || initialExpenses.length === 0) {
      refreshExpenses();
    }
  }, [refreshExpenses, initialExpenses]);

  const value = {
    expenses,
    loading,
    error,
    refreshExpenses,
    updateExpense,
    createExpense,
    deleteExpense,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
