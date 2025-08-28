export const today = new Date();

export const ym = {
  y: today.getFullYear(),
  m: today.getMonth() + 1,
  d: today.getDate(),
};

export const monthStart = new Date(ym.y, ym.m - 1, 1);
export const monthEnd   = new Date(ym.y, ym.m, 0);

export const dateK = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;

export function inThisMonth(isoStr?: string) {
  if (!isoStr) return false;
  const d = new Date(isoStr);
  const todayEnd = new Date(ym.y, ym.m - 1, ym.d, 23, 59, 59);
  return d >= monthStart && d <= todayEnd;
}
