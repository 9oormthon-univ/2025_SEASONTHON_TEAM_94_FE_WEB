// features/home/pages/HomePage.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import HomeSummary from '../components/HomeSummary';
import { useHome } from '../hooks/useHome';
import PaymentHistoryIcon from '@/assets/PaymentHistory.svg';

export default function HomePage() {
  const {
    ym,
    monthStart,
    monthEnd,
    userName,
    total,
    totalCount,
    monthlyGoal,
    leftToGoal,
    ratio,
    isOver,
    hasGoal,
    hasExpense,
    loading,
  } = useHome();

  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(ym.m);

  const ITEM_H = 60;
  const VISIBLE_COUNT = 4;
  const PICKER_H = ITEM_H * VISIBLE_COUNT;
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const listRef = useRef<HTMLDivElement | null>(null);
  const [focusedMonth, setFocusedMonth] = useState<number>(selectedMonth);

  const TOP_BUFFER = (PICKER_H - ITEM_H) / 2;

  useEffect(() => {
    if (!isMonthModalOpen || !listRef.current) return;
    setFocusedMonth(selectedMonth);
    const el = listRef.current;
    const targetTop = TOP_BUFFER + (selectedMonth - 1) * ITEM_H;
    requestAnimationFrame(() => {
      el.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
    });
  }, [isMonthModalOpen, selectedMonth]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const BIAS = 3;
    const raw = (el.scrollTop - TOP_BUFFER + BIAS) / ITEM_H;
    const idx = Math.round(raw);
    const clamped = Math.min(Math.max(idx, 0), months.length - 1);
    setFocusedMonth(months[clamped]);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = listRef.current;
    if (!el) return;
    const dir = Math.sign(e.deltaY);
    const target = el.scrollTop + dir * ITEM_H;
    el.scrollTo({ top: target, behavior: 'smooth' });
  };

  const snapToFocused = () => {
    const el = listRef.current;
    if (!el) return;
    const targetTop = TOP_BUFFER + (focusedMonth - 1) * ITEM_H;
    el.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative max-w-md mx-auto pb-10">
      <div className="bg-slate-50 py-4">
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[21px] font-bold text-gray-900">
              {userName} 님
            </h2>

            <button
              type="button"
              aria-label="결제 내역으로 이동"
              onClick={() => {
                /* TODO: 경로 연결 예정 */
              }}
              className="p-1 rounded-md active:scale-95 transition"
            >
              <img
                src={PaymentHistoryIcon}
                alt=""
                className="w-6 h-6"
                onClick={() =>
                  (window.location.href = '/expenses/unclassified')
                }
              />
            </button>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsMonthModalOpen(true)}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-gray-900
                         bg-white px-3 py-1 rounded-lg"
            >
              {selectedMonth}월
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <motion.div
          className="px-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="h-40 rounded-xl bg-white/60 animate-pulse" />
          ) : (
            <HomeSummary
              userName={userName}
              total={total}
              totalCount={totalCount}
              monthlyGoal={monthlyGoal}
              leftToGoal={leftToGoal}
              ratio={ratio}
              isOver={isOver}
              hasGoal={hasGoal}
              hasExpense={hasExpense}
              monthStart={monthStart}
              monthEnd={monthEnd}
              onOpenExpenses={() => (window.location.href = '/expenses/over')}
              onOpenFixed={() => (window.location.href = '/expenses/fixed')}
              onEditGoal={() => (window.location.href = '/reports/budget-goal')}
            />
          )}
        </motion.div>
      </div>

      {isMonthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-64 rounded-xl bg-white p-4">
            <h3 className="text-center text-base font-semibold mb-3">
              기간 선택
            </h3>

            <div className="relative" style={{ height: PICKER_H }}>
              <div
                className="pointer-events-none absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${TOP_BUFFER}px` }}
              />
              <div
                className="pointer-events-none absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${TOP_BUFFER + ITEM_H}px` }}
              />

              <div
                ref={listRef}
                onWheel={handleWheel}
                onScroll={handleScroll}
                onMouseUp={snapToFocused}
                onTouchEnd={snapToFocused}
                className="h-full overflow-auto snap-y snap-proximity"
                style={
                  {
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'auto',
                  } as React.CSSProperties
                }
              >
                <div style={{ height: TOP_BUFFER }} />
                {months.map(m => {
                  const active = m === focusedMonth;
                  return (
                    <div
                      key={m}
                      className="snap-center snap-always flex items-center justify-center select-none"
                      style={{ height: ITEM_H }}
                    >
                      <span
                        className={
                          active
                            ? 'text-main-orange font-semibold'
                            : 'text-gray-400'
                        }
                      >
                        {m}월
                      </span>
                    </div>
                  );
                })}
                <div style={{ height: TOP_BUFFER }} />
              </div>
            </div>

            <button
              className="mt-4 w-full py-2 rounded-md bg-main-orange text-white font-medium"
              onClick={() => {
                setSelectedMonth(focusedMonth);
                setIsMonthModalOpen(false);
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
