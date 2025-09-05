// features/reports/pages/ReportPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Header } from '@/shared/components/Header';
import ReportSummary from '../components/ReportSummary';
import { useReport } from '../hooks/useReport';
import { getMe, type UserResponse } from '@/features/profile/api/user';

export default function ReportPage() {
  const {
    ym,
    today,
    monthStart,
    monthEnd,
    total,
    totalCount,
    monthlyGoal,
    isOver,
  } = useReport();

  const [userName, setUserName] = useState<string>('사용자');
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const me = await getMe(ctrl.signal);
        const name = me.nickname?.trim() || me.username?.trim() || '사용자';
        setUserName(name);
      } catch {}
    })();

    const onChanged = (e: Event) => {
      const { nickname } = (e as CustomEvent).detail || {};
      if (nickname) setUserName(nickname);
    };
    window.addEventListener('nickname:changed', onChanged as EventListener);
    return () => {
      ctrl.abort();
      window.removeEventListener(
        'nickname:changed',
        onChanged as EventListener
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto pb-10">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <section className="bg-gray-100 py-4">
          <div className="sticky top-10 z-10 bg-gray-100/95 backdrop-blur supports-[backdrop-filter]:bg-gray-100">
            <div className="px-4 pt-2 pb-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span aria-live="polite">{`${ym.m}월 ${ym.d}일`}</span>
              </div>
              <h2 className="mt-1 text-xl font-extrabold !text-sub-blue">
                {userName} 님의 지출분석
              </h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.2 }}
          >
            <ReportSummary
              monthlyGoal={monthlyGoal}
              total={total}
              totalCount={totalCount}
              isOver={isOver}
              showList={false}
              monthStart={monthStart}
              monthEnd={monthEnd}
              today={today}
              monthOverCount={0}
              monthFixedCount={0}
              overSum={0}
              fixedSum={0}
            />
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
