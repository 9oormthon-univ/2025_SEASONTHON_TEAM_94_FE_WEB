import * as React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { format, endOfToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/shared/components/ui/calendar';
import { OverExpenseItem, formatDateHeader } from '@/features/expenses';
import emptyImage from '@/assets/empty.png';
import { useCalendarExpenses } from '@/features/calendar/hooks/useCalendarExpenses';

const won = (n: number) => n.toLocaleString('ko-KR');
const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function ExpensesCalendarPage() {
  const navigate = useNavigate();

  const {
    selectedDate,
    setSelectedDate,
    visibleMonth,
    setVisibleMonth,
    ymd,
    expenses,
    loading,
    error,
    monthTotals, 
    handleTransactionUpdate,
  } = useCalendarExpenses();


  const todayEnd = endOfToday();

  // 미래 날짜 선택 방지
  const onSelect = (d?: Date) => {
    if (!d) return;
    if (d.getTime() > todayEnd.getTime()) return;
    setSelectedDate(d);
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">데이터를 불러오는데 실패했습니다.</p>
          <button
            onClick={handleTransactionUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const DayContent = React.useMemo(() => {
  return function DayContentImpl(props: any) {
    const date: Date | undefined = props?.date;
    if (!(date instanceof Date) || isNaN(date.getTime())) return props?.children ?? null;

    const dayKey = String(date.getDate());                  
    const dayNum = format(date, 'd', { locale: ko });
    const isFuture = date.getTime() > todayEnd.getTime();

    const raw = monthTotals?.[dayKey];
    const hasAny = !isFuture && typeof raw === 'number' && raw !== 0;

    return (
      <div className="flex flex-col items-center justify-center leading-none">
        <span>{dayNum}</span>
        {hasAny && (
          <span className="mt-[6px] text-[10px] leading-none text-[#ff3b30] font-semibold">
            -{won(Math.abs(raw))}원
          </span>
        )}
      </div>
    );
  };
}, [monthTotals, todayEnd]);



  return (
    <div className="bg-slate-50 relative w-full max-w-md mx-auto min-h-screen">
      <div className="bg-white px-4 pt-2 pb-4">
        <style>{`
          .calendar-wrapper .rdp-month { position: relative; }
          .calendar-wrapper .rdp-nav{
            position: absolute !important;
            top: calc(var(--cell-size) / 2) !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 140px;
            display: flex; align-items: center; justify-content: space-between; gap: 8px;
            z-index: 10; pointer-events: auto;
          }
          .calendar-wrapper .rdp-caption_label { pointer-events: none; }

          .calendar-wrapper [data-selected-single="true"]{
            background: transparent !important;
            color: var(--main-orange) !important;
            box-shadow: none !important;
          }

          .calendar-wrapper .rdp-day_button {
            position: relative;
            height: var(--cell-size);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;            
            overflow: visible;   
            font-weight: 600;
          }

          .calendar-wrapper .rdp-day_disabled .rdp-day_button { 
            pointer-events: none; 
            cursor: default; 
          }
          .calendar-wrapper .rdp-day_disabled .rdp-day_button > span { 
            color: #BFBFBF !important; 
            opacity: 1 !important; 
            font-weight: 600; 
          }

          .calendar-wrapper .rdp-caption_label { font-weight: 700; }
          .calendar-wrapper .rdp-weekday { font-weight: 600; }
          .calendar-wrapper .rdp-day_button > span { 
            opacity: 1 !important; 
            font-weight: 600; 
          `}
</style>

        <div className="calendar-wrapper flex justify-center">
          <Calendar
            locale={ko}
            formatters={{
              formatCaption: m => format(m, 'M월', { locale: ko }),
              formatWeekdayName: d => format(d, 'EEEEE', { locale: ko }),
            }}
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            showOutsideDays={false}
            disabled={{ after: todayEnd }}
            className="rounded-md mx-auto [--cell-size:46px]"

            renderDayContent={({ date }) => {
              const dayKey = String(date.getDate());                
              const dayNum = format(date, 'd', { locale: ko });
              const isFuture = date.getTime() > todayEnd.getTime();

              const raw = monthTotals?.[dayKey];
              const hasAny = !isFuture && typeof raw === 'number' && raw !== 0;

              return (
                <>
                  <span className="leading-none">{dayNum}</span>
                  <span
                    className={`text-[10px] leading-[12px] h-[12px] font-semibold text-[#ff3b30] ${
                      hasAny ? '' : 'invisible'
                    }`}
                  >
                    -{won(Math.abs(raw ?? 0))}원
                  </span>
                </>
              );
            }}
          />
        </div>
      </div>

      <div className="px-5 pt-3 text-sub-gray text-sm font-medium">
        {formatDateHeader(ymd)}
      </div>

      <div className="px-5 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-main-orange" />
          </div>
        ) : (
          <motion.div
            key={ymd}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          >
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center text-center mt-6 mb-24 pt-6 pb-4 min-h-[300px]">
                <div className="mb-6 flex justify-center">
                  <img src={emptyImage} alt="빈 상태" className="w-[160px] h-[160px] object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2">아직 내역이 없어요</h3>
                <p className="text-xs font-normal leading-6">
                  미분류 내역에서 분류를 진행하거나
                  <br />
                  새로운 내역을 추가해주세요!
                </p>
              </div>
            ) : (
              <div className="space-y-3 pb-28">
                {expenses.map(expense => (
                  <OverExpenseItem
                    key={expense.id}
                    expense={expense}
                    onUpdate={handleTransactionUpdate}
                    onClick={() => navigate(`/expenses/${expense.id}`)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
    