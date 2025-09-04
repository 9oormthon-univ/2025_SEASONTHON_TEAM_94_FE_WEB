// features/reports/hooks/useBudgetGoal.ts
import { useEffect, useMemo, useState } from 'react';
import {
  getBudgetGoalByDate,
  createBudgetGoal,
  updateBudgetGoal,
} from '@/features/more/api/budgetGoals';
import type { BudgetGoalResponse } from '@/shared/types/budget';

interface UseBudgetGoalOptions {
  date?: string;
  idFromRoute?: number;
}

export function useBudgetGoal(opts: UseBudgetGoalOptions = {}) {
  const { date, idFromRoute } = opts;

  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<BudgetGoalResponse | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const hasExisting = useMemo(() => !!goal?.id || !!idFromRoute, [goal, idFromRoute]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getBudgetGoalByDate({ date });
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
  }, [ date]);

  async function save() {
    if (!Number.isFinite(price) || price < 0) return;
    try {
      setSaving(true);
      if (hasExisting) {
        const id = (goal?.id ?? idFromRoute)!;
        const res = await updateBudgetGoal(id, { price });
        setGoal(res.data);
      } else {
        const res = await createBudgetGoal({ price });
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
    hasExisting, 
    save,
  };
}
