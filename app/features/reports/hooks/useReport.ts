// features/reports/hooks/useReport.ts
import { useEffect, useState } from 'react';
import { inThisMonth, monthEnd, monthStart, today, ym } from '../utils/date';
import { fmt } from '../utils/number';
import { get } from '@/features/more/api/index';
import type { TransactionResponse } from '@/features/more/api/transactions';

// ===== 테스트용 상수 =====
const USER_UID = 'a';  // 유저 하나로만 테스트
const GOAL_ID  = 1;    // /budgetgoals/{id} 의 id

// ===== 타입 =====
type BudgetGoalResponse = {
  id: number;
  price: number;
  userUid: string;
  createdAt: string;
  updatedAt: string;
};

// ===== 헬퍼: 월 목표 금액(price) 조회 =====
async function fetchMonthlyGoal(signal?: AbortSignal): Promise<number> {
  try {
    // get()이 data를 풀어서 반환하므로 바로 BudgetGoalResponse로 받는다
    const goal = await get<BudgetGoalResponse>(
      `/api/v1/budgetgoals/${GOAL_ID}`,
      { userUid: USER_UID },
      signal
    );
    return Number.isFinite(goal?.price) ? Math.max(0, goal.price) : 0;
  } catch {
    return 0;
  }
}

// ===== 헬퍼: 트랜잭션 조회 =====
async function fetchTransactionsByType(
  type: 'OVER_EXPENSE' | 'FIXED_EXPENSE',
  signal?: AbortSignal
): Promise<TransactionResponse[]> {
  try {
    return await get<TransactionResponse[]>(
      `/api/v1/transactions`,
      { userUid: USER_UID, type },
      signal
    );
  } catch {
    // 타입별 엔드포인트 실패 시 전체를 불러 폴백
    try {
      const all = await get<TransactionResponse[]>(
        `/api/v1/transactions`,
        { userUid: USER_UID },
        signal
      );
      return all.filter((t: TransactionResponse) => t.type === type);
    } catch {
      return [];
    }
  }
}

// ===== 메인 훅 =====
export function useReport() {
  const [overList, setOverList]   = useState<TransactionResponse[]>([]);
  const [fixedList, setFixedList] = useState<TransactionResponse[]>([]);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);

  // 1) 목표 금액(price) 로드
  useEffect(() => {
    const ac = new AbortController();
    fetchMonthlyGoal(ac.signal)
      .then(setMonthlyGoal)
      .catch(() => setMonthlyGoal(0));
    return () => ac.abort();
  }, []);

  // 2) 트랜잭션 로드
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      const [over, fixed] = await Promise.all([
        fetchTransactionsByType('OVER_EXPENSE', ac.signal),
        fetchTransactionsByType('FIXED_EXPENSE', ac.signal),
      ]);
      setOverList(over);
      setFixedList(fixed);
    })();
    return () => ac.abort();
  }, []);

  // 3) 이번 달 필터링/집계
  const monthOver  = overList.filter(t => inThisMonth(t.createdAt || t.startAt));
  const monthFixed = fixedList.filter(t => inThisMonth(t.createdAt || t.startAt));

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

  // ProgressBar에 넘겨줄 라벨 위치 보정(선택 prop로 넘길 수 있음)
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
