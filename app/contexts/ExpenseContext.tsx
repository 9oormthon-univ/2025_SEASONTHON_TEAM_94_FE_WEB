import React, { createContext, useState, useContext, useCallback } from 'react';
import { updateExpense as updateNativeExpense } from '@/api/nativeBridge.js';
import type { Expense } from '@/lib/constants';

interface ExpenseContextType {
  expenses: Expense[];
  updateExpense: (expense: Expense) => void;
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function ExpenseProvider({
  children,
  initialExpenses
}: {
  children: React.ReactNode;
  initialExpenses?: Expense[];
}) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses || []);

  const updateExpense = useCallback((updatedExpense: Expense) => {
    // 1. 네이티브 DB에 업데이트 요청
    updateNativeExpense(updatedExpense);
    // 2. UI 즉시 반영 (Optimistic Update)
    setExpenses(prev =>
      prev.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp))
    );
  }, []);

  const value = { expenses, updateExpense };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
