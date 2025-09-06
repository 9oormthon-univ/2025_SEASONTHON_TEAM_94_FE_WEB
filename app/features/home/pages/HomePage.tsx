import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import HomeSummary from '../components/HomeSummary';
import { useHome } from '../hooks/useHome';
import PaymentHistoryIcon from '@/assets/PaymentHistory.svg';
import {
  WheelPicker,
  WheelPickerWrapper,
  type WheelPickerOption,
} from '@/shared/components/wheel-picker';

export default function HomePage() {

  const now = new Date();
  const [year] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);

  const {
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
    unclassifiedCount,
  } = useHome({ year, month: selectedMonth });

  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [tempMonthValue, setTempMonthValue] = useState<string>(String(selectedMonth));

  useEffect(() => {
    if (isMonthModalOpen) setTempMonthValue(String(selectedMonth));
  }, [isMonthModalOpen, selectedMonth]);

  const monthOptions: WheelPickerOption[] = useMemo(
    () => Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      return { value: String(m), label: `${m}월` };
    }),
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 relative max-w-md mx-auto pb-10">
      <div className="bg-slate-50 py-4">
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[21px] font-bold text-gray-900">{userName} 님</h2>

            <button
              type="button"
              aria-label="결제 내역으로 이동"
              className="relative p-1 rounded-md active:scale-95 transition"
              onClick={() => (window.location.href = '/expenses/unclassified')}
            >
              <img src={PaymentHistoryIcon} alt="" className="w-6 h-6" />

              {unclassifiedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1
                                text-[10px] leading-4 text-white font-bold
                                bg-[#FF6200] rounded-full flex items-center justify-center">
                  {unclassifiedCount > 99 ? '99+' : unclassifiedCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsMonthModalOpen(true)}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg"
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
              onEditGoal={() => (window.location.href = '/profile/budget-goal')}
            />
          )}
        </motion.div>
      </div>

      {isMonthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-64 rounded-xl bg-white p-4">
            <h3 className="text-center text-base font-semibold mb-3">기간 선택</h3>

            <WheelPickerWrapper className="mx-auto">
              <WheelPicker
                options={monthOptions}
                value={tempMonthValue}
                onValueChange={setTempMonthValue}
              />
            </WheelPickerWrapper>

            <button
              className="mt-4 w-full py-2 rounded-md bg-main-orange text-white font-medium"
              onClick={() => {
                setSelectedMonth(Number(tempMonthValue)); 
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
