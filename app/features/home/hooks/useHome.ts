import { useEffect, useMemo, useState } from 'react';
import { getBudgetGoalByDate } from '@/features/reports/api/budgetGoals';
import { fetchMonthlyReportSum } from '@/features/reports/api/reportApi';
import { getMe } from '@/features/profile/api/user';
import type { BudgetGoalResponse } from '@/shared/types/budget';
import type { TransactionReportResponse } from '@/shared/types/expense';

const pad2 = (n: number) => String(n).padStart(2, '0');
const toYMD = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

type UseHomeParams = { year?: number; month?: number }; // 1~12

export function useHome(params?: UseHomeParams) {
  const today = new Date();
  const year = params?.year ?? today.getFullYear();
  const month = params?.month ?? today.getMonth() + 1;

  const startDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);
  const endDate   = useMemo(() => new Date(year, month, 0),   [year, month]);


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
        const res = await getBudgetGoalByDate({ date: toYMD(startDate) });
        const goal: BudgetGoalResponse | null = res.data;
        setMonthlyGoal(Math.max(0, goal?.price ?? 0));
      } catch {
        setMonthlyGoal(0);
      }
    })();
  }, [year, month]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const r = await fetchMonthlyReportSum({
          startAt: startDate,   
          endAt: endDate,       
          signal: ctrl.signal,
        });
        setReport(r);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [year, month]);

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
    year,
    month,
    monthStart: startDate, 
    monthEnd: endDate,    
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
