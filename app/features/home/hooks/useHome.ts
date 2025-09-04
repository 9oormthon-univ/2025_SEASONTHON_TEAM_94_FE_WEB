// features/home/hooks/useHome.ts
import { useEffect, useMemo, useState } from 'react';
import { monthEnd, monthStart, today, ym } from '@/features/reports/utils/date';
import { getBudgetGoalByDate } from '@/features/more/api/budgetGoals';
import { fetchMonthlyReportSum } from '@/features/reports/api/reportApi';
import { getMe } from '@/features/profile/api/user';
import type { BudgetGoalResponse } from '@/shared/types/budget';
import type { TransactionReportResponse } from '@/shared/types/expense';

export function useHome() {
  const [userName, setUserName] = useState('사용자');
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [report, setReport] = useState<TransactionReportResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const me = await getMe(ctrl.signal);
        setUserName(me.nickname?.trim() || me.username?.trim() || '사용자');
      } catch {}
    })();
    const onChanged = (e: Event) => {
      const { nickname } = (e as CustomEvent).detail || {};
      if (nickname) setUserName(nickname);
    };
    window.addEventListener('nickname:changed', onChanged as EventListener);
    return () => {
      ctrl.abort();
      window.removeEventListener('nickname:changed', onChanged as EventListener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBudgetGoalByDate({ date: new Date().toISOString().split('T')[0] });
        const goal: BudgetGoalResponse | null = res.data;
        setMonthlyGoal(Math.max(0, goal?.price ?? 0));
      } catch {
        setMonthlyGoal(0);
      }
    })();
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const r = await fetchMonthlyReportSum({
          startAt: monthStart,
          endAt: monthEnd,
          signal: ctrl.signal,
        });
        setReport(r);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [monthStart, monthEnd]);

  const total = Math.max(0, report?.totalPrice ?? 0);
  const totalCount = report?.totalCount ?? 0;
  const hasExpense = total > 0;
  const hasGoal = monthlyGoal > 0;
  const leftToGoal = Math.max(0, monthlyGoal - total);
  const ratio = hasGoal ? Math.min(100, (total / monthlyGoal) * 100) : 0;
  const isOver = hasGoal && total > monthlyGoal;

  const state = useMemo(() => {
    if (!hasGoal && hasExpense) return 'NO_GOAL_HAS_EXPENSE';
    if (!hasExpense && hasGoal) return 'NO_EXPENSE_HAS_GOAL';
    if (!hasExpense && !hasGoal) return 'EMPTY'; 
    return isOver ? 'OVER' : 'NORMAL';
  }, [hasGoal, hasExpense, isOver]);

  return {
    ym, today, monthStart, monthEnd,

    userName,
    monthlyGoal,
    total,
    totalCount,
    leftToGoal,
    ratio,
    isOver,
    hasGoal,
    hasExpense,
    state,
    loading,
  };
}

export type HomeState =
  | 'NORMAL'               
  | 'OVER'                
  | 'NO_GOAL_HAS_EXPENSE'  
  | 'NO_EXPENSE_HAS_GOAL' 
  | 'EMPTY';               