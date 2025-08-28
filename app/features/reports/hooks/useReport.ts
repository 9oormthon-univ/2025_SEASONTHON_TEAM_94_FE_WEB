import { useEffect, useMemo, useState } from 'react';
import { inThisMonth, monthEnd, monthStart, today, ym } from '../utils/date';
import { fmt } from '../utils/number';
import type { TransactionResponse } from '../types';

const API_BASE = 'https://api.stopusing.klr.kr';
const USER_UID = 'a';

async function quietFetch(url: string, signal?: AbortSignal): Promise<TransactionResponse[]> {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export function useReport() {
  const [overList, setOverList] = useState<TransactionResponse[]>([]);
  const [fixedList, setFixedList] = useState<TransactionResponse[]>([]);

  const monthlyGoal = useMemo(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('monthlyGoal') : null;
    const v = raw ? Number(raw) : 0;
    return Number.isFinite(v) && v > 0 ? v : 0;
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      const urlOver  = `${API_BASE}/api/v1/transactions?userUid=${USER_UID}&type=OVER_EXPENSE`;
      const urlFixed = `${API_BASE}/api/v1/transactions?userUid=${USER_UID}&type=FIXED_EXPENSE`;
      let [over, fixed] = await Promise.all([quietFetch(urlOver, ac.signal), quietFetch(urlFixed, ac.signal)]);
      if (over.length === 0 || fixed.length === 0) {
        const urlAll = `${API_BASE}/api/v1/transactions?userUid=${USER_UID}`;
        const all = await quietFetch(urlAll, ac.signal);
        if (over.length === 0)  over  = all.filter(t => t.type === 'OVER_EXPENSE');
        if (fixed.length === 0) fixed = all.filter(t => t.type === 'FIXED_EXPENSE');
      }
      setOverList(over); setFixedList(fixed);
    })();
    return () => ac.abort();
  }, []);

  const monthOver  = overList.filter(t => inThisMonth(t.createdAt || t.startAt));
  const monthFixed = fixedList.filter(t => inThisMonth(t.createdAt || t.startAt));

  const overSum  = monthOver.reduce((s, t) => s + (t.price || 0), 0);
  const fixedSum = monthFixed.reduce((s, t) => s + (t.price || 0), 0);
  const total    = overSum + fixedSum;

  const rawPercent = monthlyGoal > 0 ? (total / monthlyGoal) * 100 : 100;
  const barPercent = Math.max(0, Math.min(100, rawPercent));
  const percentCenterLeft = Math.max(0, Math.min(100, barPercent / 2));
  const diff   = monthlyGoal > 0 ? monthlyGoal - total : -overSum;
  const isOver = monthlyGoal > 0 && total > monthlyGoal;
  const barLabel = monthlyGoal > 0
    ? (isOver ? `+ ${fmt(Math.abs(diff))}` : `- ${fmt(Math.abs(diff))}`)
    : `- ${fmt(overSum)}`;
  const markerLeft = Math.max(12, Math.min(92, barPercent));
  const isEdge = barPercent <= 12 || barPercent >= 92;
  const labelTransform = isEdge ? 'translateX(calc(-100% - 6px))' : 'translateX(-50%)';

  return {
    ym, today, monthStart, monthEnd,
    monthOver, monthFixed, overSum, fixedSum, total,
    monthlyGoal, barPercent, percentCenterLeft, barLabel,
    markerLeft, labelTransform, isOver,
  };
}
