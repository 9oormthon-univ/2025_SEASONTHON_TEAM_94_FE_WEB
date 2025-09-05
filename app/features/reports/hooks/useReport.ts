// features/reports/hooks/useReport.ts
import { useEffect, useState } from 'react';
import { monthEnd, monthStart, today, ym } from '../utils/date';
import { getBudgetGoalByDate } from '@/features/reports/api/budgetGoals';
import { fetchMonthlyReportSum } from '../api/reportApi';
import type { BudgetGoalResponse } from '@/shared/types/budget';
import type { TransactionReportResponse } from '@/shared/types/expense';

async function fetchMonthlyGoal() {
  try {
    const res = await getBudgetGoalByDate({ date: new Date().toISOString().split('T')[0] });
    const goal: BudgetGoalResponse | null = res.data;
    const price = goal?.price;
    return Number.isFinite(price) ? Math.max(0, price) : 0;
  } catch { return 0; }
}

export function useReport() {
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [report, setReport] = useState<TransactionReportResponse | null>(null);

  useEffect(() => { fetchMonthlyGoal().then(setMonthlyGoal).catch(() => setMonthlyGoal(0)); }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const r = await fetchMonthlyReportSum({
          startAt: monthStart,
          endAt: monthEnd,
          signal: ctrl.signal,
        });
        setReport(r);
      } catch {
        setReport(null);
      }
    })();
    return () => ctrl.abort();
  }, [monthStart, monthEnd]);

  const total = Math.max(0, report?.totalPrice ?? 0);
  const totalCount = report?.totalCount ?? 0;
  const isOver = monthlyGoal > 0 && total > monthlyGoal;

  const serverStart = report?.startAt ? new Date(report.startAt) : monthStart;
  const serverEnd   = report?.endAt   ? new Date(report.endAt)   : monthEnd;

  return {
    ym, today, monthStart, monthEnd,
    total, totalCount,
    reportStart: serverStart,
    reportEnd: serverEnd,
    monthlyGoal, isOver,
  };
}
