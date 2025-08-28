import type { ApiList, TransactionResponse } from '../types';

const API_BASE = 'https://api.stopusing.klr.kr';
const USER_UID = 'a';

async function quietFetch(url: string, signal?: AbortSignal): Promise<TransactionResponse[]> {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiList<TransactionResponse[]>;
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchOverAndFixed(signal?: AbortSignal) {
  const urlOver  = `${API_BASE}/api/v1/transactions?userUid=${USER_UID}&type=OVER_EXPENSE`;
  const urlFixed = `${API_BASE}/api/v1/transactions?userUid=${USER_UID}&type=FIXED_EXPENSE`;

  let [over, fixed] = await Promise.all([
    quietFetch(urlOver, signal),
    quietFetch(urlFixed, signal),
  ]);

  if (over.length === 0 || fixed.length === 0) {
    const urlAll = `${API_BASE}/api/v1/transactions?userUid=${USER_UID}`;
    const all = await quietFetch(urlAll, signal);
    if (over.length === 0)  over  = all.filter(t => t.type === 'OVER_EXPENSE');
    if (fixed.length === 0) fixed = all.filter(t => t.type === 'FIXED_EXPENSE');
  }

  return { over, fixed };
}
