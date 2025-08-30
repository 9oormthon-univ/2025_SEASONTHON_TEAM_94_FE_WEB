// features/reports/pages/ReportPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import ProgressBar from '../components/ProgressBar';
import ReportSummary from '../components/ReportSummary';
import { useReport } from '../hooks/useReport';
import { fmt } from '../utils/number';
import { dateK } from '../utils/date';
import { Button } from '@/shared/components/ui/button';

// ✅ 추가: 현재 사용자 API 불러오기
import { fetchCurrentUser, type CurrentUser } from '@/features/more/api/user';

export default function ReportPage() {
  const navigate = useNavigate();
  const {
    ym, today, monthStart, monthEnd,
    monthOver, monthFixed, overSum, fixedSum, total,
    monthlyGoal, barPercent, percentCenterLeft, barLabel, isOver,
  } = useReport();

  // ✅ 추가: 사용자 상태
  const [user, setUser] = useState<CurrentUser | null>(null);

  // ✅ 추가: 마운트 시 현재 사용자 불러오기 (테스트용 'a')
  useEffect(() => {
    (async () => {
      const me = await fetchCurrentUser('a'); // TODO: 실제 로그인 유저로 교체
      setUser(me);
    })();
  }, []);

  // ✅ 추가: 닉네임 변경 이벤트 실시간 반영
  useEffect(() => {
    const onChanged = (e: Event) => {
      const { nickname } = (e as CustomEvent).detail || {};
      if (!nickname) return;
      setUser(prev => (prev ? { ...prev, name: nickname } : prev));
    };
    window.addEventListener('nickname:changed', onChanged as EventListener);
    return () => window.removeEventListener('nickname:changed', onChanged as EventListener);
  }, []);

  const displayName = user?.name ?? '사용자';

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto pb-20">
      <ExpenseHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <section className="bg-[#F5F5F5] py-4">
          <div className="sticky top-10 z-10 bg-[#F5F5F5]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5F5F5]">
            <div className="px-4 pt-2 pb-3">
              <div className="flex items-center gap-1 text-sm text-[#757575]">
                <span>{`${ym.m}월 ${ym.d}일`}</span>
                <motion.button
                  type="button"
                  aria-label="날짜 선택"
                  className="p-1 -m-1 rounded outline-none hover:bg-black/5 active:bg-black/10"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { /* openMonthPicker(true) */ }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              </div>

              {/* 🔁 여기만 바꾸면 됨: 하드코딩된 '여울 님' → 사용자 닉네임 */}
              <h2 className="mt-1 text-xl font-extrabold !text-[#002B5B]">
                {displayName} 님의 지출분석
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
              isOver={isOver}
              total={total}
              monthOverCount={monthOver.length}
              monthFixedCount={monthFixed.length}
              overSum={overSum}
              fixedSum={fixedSum}
              monthStart={monthStart}
              monthEnd={monthEnd}
              today={today}
              showList={false}
              barPercent={barPercent}
              progressEl={
                <ProgressBar
                  barPercent={barPercent}
                  percentCenterLeft={percentCenterLeft}
                  barLabel={barLabel}
                />
              }
            />
          </motion.div>
        </section>

        <motion.div
          className="bg-white px-4 pt-4 pb-24 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.2 }}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-[#002B5B]">목표 초과지출</div>
              <div className="text-[11px] text-[#757575]">
                {`${dateK(monthStart)} - ${dateK(monthEnd)}`}
              </div>
            </div>
            <div className="mt-2 text-xl font-medium text-[#FF6200]">
              - {fmt(monthlyGoal)}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-[#002B5B]">초과지출</div>
              <div className="text-[11px] text-[#757575]">
                {`${dateK(monthStart)} - ${dateK(today)} · ${monthOver.length}번 지출`}
              </div>
            </div>
            <div className="mt-2 text-xl font-medium text-[#FF6200]">- {fmt(overSum)}</div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-[#002B5B]">고정지출</div>
              <div className="text-[11px] text-[#757575]">
                {`${dateK(monthStart)} - ${dateK(monthEnd)} · ${monthFixed.length}번 지출`}
              </div>
            </div>
            <div className="mt-2 text-xl font-medium text-[#757575]">- {fmt(fixedSum)}</div>
          </div>

          <div className="pt-2">
            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                onClick={() => navigate('/reports/budget-goal')}
                className="
                  mx-auto w-[364px] max-w-full h-[45px]
                  !rounded-[8px] px-[10px] flex items-center justify-center
                  !font-light !text-white text-center shadow-md active:shadow-sm
                  !bg-[#FF6200] hover:opacity-90 disabled:opacity-100
                "
              >
                {monthlyGoal > 0 ? '목표 지출 줄이러 가기' : '목표 지출 설정하기'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
