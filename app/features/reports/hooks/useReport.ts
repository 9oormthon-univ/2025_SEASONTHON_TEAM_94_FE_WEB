// features/reports/hooks/useReport.ts
import { useEffect, useState } from 'react';
import { inThisMonth, monthEnd, monthStart, today, ym } from '../utils/date';
import { fmt } from '../utils/number';

import { fetchOverAndFixed } from '../api/reportApi';
import { getBudgetGoalById } from '@/features/more/api/budgetGoals';

import type { Transaction } from '@/shared/types/expense';

const USER_UID = 'a';  

async function fetchMonthlyGoal(): Promise<number> {
  try {
    const res = await getBudgetGoalById(1, { userUid: USER_UID }); // ✅ userUid 전달
    const price = res?.data?.price;
    return Number.isFinite(price) ? Math.max(0, price) : 0;
  } catch {
    return 0;
  }
}

export function useReport() {
  const [overList, setOverList]   = useState<Transaction[]>([]);
  const [fixedList, setFixedList] = useState<Transaction[]>([]);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);

  // 1) 목표 금액(price) 로드
  useEffect(() => {
    fetchMonthlyGoal()
      .then(setMonthlyGoal)
      .catch(() => setMonthlyGoal(0));
  }, []);

  // 2) 트랜잭션 로드
  useEffect(() => {
    (async () => {
      const { over, fixed } = await fetchOverAndFixed({ userUid: USER_UID });
      setOverList(over);
      setFixedList(fixed);
    })();
  }, []);

  // 3) 이번 달 필터링/집계
  const monthOver  = overList.filter(t => inThisMonth(t.createdAt || (t as any).startAt));
  const monthFixed = fixedList.filter(t => inThisMonth(t.createdAt || (t as any).startAt));

  const overSum  = monthOver.reduce((s, t) => s + (t.price || 0), 0);
  const fixedSum = monthFixed.reduce((s, t) => s + (t.price || 0), 0);
  const total    = overSum + fixedSum;

  // 4) 바/라벨 계산
  const rawPercent = monthlyGoal > 0 ? (total / monthlyGoal) * 100 : 100;
  const barPercent = Math.max(0, Math.min(100, rawPercent));
  const percentCenterLeft = Math.max(0, Math.min(100, barPercent / 2));

  const diff   = monthlyGoal > 0 ? monthlyGoal - total : -overSum;
  const isOver = monthlyGoal > 0 && total > monthlyGoal;
  const barLabel = monthlyGoal > 0
    ? (isOver ? `+ ${fmt(Math.abs(diff))}` : `- ${fmt(Math.abs(diff))}`)
    : `- ${fmt(overSum)}`;

  const labelTransform =
    barPercent <= 12 || barPercent >= 92
      ? 'translateX(calc(-100% - 6px))'
      : 'translateX(-50%)';

  return {
    // 날짜 관련
    ym, today, monthStart, monthEnd,
    // 목록/합계
    monthOver, monthFixed, overSum, fixedSum, total,
    // 목표/바/라벨
    monthlyGoal, barPercent, percentCenterLeft, barLabel, labelTransform, isOver,
  };
}
