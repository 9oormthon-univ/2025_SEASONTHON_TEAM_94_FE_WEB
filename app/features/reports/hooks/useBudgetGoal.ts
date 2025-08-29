// features/reports/hooks/useBudgetGoal.ts
import { useEffect, useMemo, useState } from 'react';
import {
  getBudgetGoalByDate,
  createBudgetGoal,
  updateBudgetGoal,
} from '@/features/more/api/budgetGoals';
import type { BudgetGoalResponse } from '@/shared/types/budget';
import { MOCK_USER_UID } from '@/shared/config/api';

interface UseBudgetGoalOptions {
  /** yyyy-MM-dd (미지정 시: 서버가 현재월 기준으로 최신값 반환) */
  date?: string;
  /** 수정 강제 모드: ?id= 로 직접 들어온 경우 사용 가능 */
  idFromRoute?: number;
}

export function useBudgetGoal(opts: UseBudgetGoalOptions = {}) {
  const userUid = MOCK_USER_UID; // TODO: 로그인 사용자로 교체
  const { date, idFromRoute } = opts;

  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<BudgetGoalResponse | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const hasExisting = useMemo(() => !!goal?.id || !!idFromRoute, [goal, idFromRoute]);

  // 로드 (해당 월 최신 1건)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getBudgetGoalByDate({ userUid, date });
        const g = res.data;
        setGoal(g);
        setPrice(g?.price ?? 0);
      } catch {
        setGoal(null);
        setPrice(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [userUid, date]);

  // 저장(신규/수정 통합)
  async function save() {
    if (!Number.isFinite(price) || price < 0) return;
    try {
      setSaving(true);
      if (hasExisting) {
        const id = (goal?.id ?? idFromRoute)!;
        const res = await updateBudgetGoal(id, { userUid }, { price });
        setGoal(res.data);
      } else {
        const res = await createBudgetGoal({ userUid, price });
        setGoal(res.data);
      }
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    loading,
    goal,
    price,
    setPrice,
    saving,
    hasExisting, // true면 "수정", false면 "저장"
    save,
  };
}
