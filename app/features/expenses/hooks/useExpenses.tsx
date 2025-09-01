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
        setLoading(true);
        setError(null);
        
        // API 호출
        const updated = await updateTransaction(userId, id, updatedExpense);
        
        // 상태 업데이트
        setExpenses(prev =>
          prev.map(expense =>
            expense.id === id ? updated : expense
          )
        );
      } catch (error) {
        setError('지출 수정에 실패했습니다.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createExpense = useCallback(
    async (newExpense: TransactionCreateRequest) => {
      try {
        setLoading(true);
        setError(null);
        
        // API 호출
        const createdExpense = await createTransaction(newExpense);
        
        // 상태에 추가
        setExpenses(prev => [createdExpense, ...prev]);
      } catch (error) {
        setError('지출 생성에 실패했습니다.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteExpense = useCallback(
    async (userId: string, id: number) => {
      try {
        setLoading(true);
        setError(null);
        
        // API 호출
        await deleteTransaction(userId, id);
        
        // 상태에서 제거
        setExpenses(prev => prev.filter(expense => expense.id !== id));
      } catch (error) {
        setError('지출 삭제에 실패했습니다.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 초기 데이터가 명시적으로 제공된 경우에만 사용
  useEffect(() => {
    if (initialExpenses && initialExpenses.length > 0) {
      setExpenses(initialExpenses);
    }
  }, [initialExpenses]);

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
