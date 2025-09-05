import * as React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Calendar } from '@/shared/components/ui/calendar';
import { OverExpenseItem, formatDateHeader } from '@/features/expenses';
import PlusIcon from '@/assets/plus.svg?react';
import emptyImage from '@/assets/empty.png';
import { useCalendarExpenses } from '../hooks/useCalendarExpenses';

const won = (n: number) => n.toLocaleString('ko-KR');

export default function ExpensesCalendarPage() {
  const navigate = useNavigate();
  const {
    selectedDate,
    setSelectedDate,
    ymd,
    expenses,
    loading,
    error,
    stats,
    handleTransactionUpdate,
  } = useCalendarExpenses();

  const onSelect = (d?: Date) => d && setSelectedDate(d);

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">데이터를 불러오는데 실패했습니다.</p>
          <button onClick={handleTransactionUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 선택된 날짜 총액(0이면 숨김)을 CSS 변수로 내려보냄
  const selectedTotal = stats.totalAmount !== 0 ? `'-${won(Math.abs(stats.totalAmount))}원'` : `''`;

  return (
    <div className="bg-[#F1F5F9] relative w-full max-w-md mx-auto min-h-screen">

      <div className="bg-white px-4 pt-2 pb-4">
        {/* 캘린더 커스텀 스타일 */}
        <style>{`
          .calendar-wrapper .rdp-month { position: relative; }  
          .calendar-wrapper .rdp-nav{
            position: absolute !important;
            top: calc(var(--cell-size) / 2) !important;   
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 96px;                                 
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            z-index: 5;                                   
            pointer-events: auto;
          }
          .calendar-wrapper .rdp-caption_label { pointer-events: none; }

          .calendar-wrapper [data-selected-single="true"]{
            background: transparent !important;
            color: #FF6200 !important;
            box-shadow: none !important;
          }

          .calendar-wrapper .rdp-day_button{ position: relative; }
          .calendar-wrapper [data-selected-single="true"]::after{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 3px;                
            margin-top: 0;
            content: var(--selected-total);
            display: block;
            font-size: 10px;
            line-height: 1;
            color: #ff3b30;
          }

          .calendar-wrapper .rdp-caption_label { font-weight: 700; }
          .calendar-wrapper .rdp-weekday { font-weight: 600; }
          .calendar-wrapper .rdp-day_button { font-weight: 600; }
          .calendar-wrapper .rdp-day_button > span { opacity: 1 !important; font-weight: 600; }
        `}</style>

        <div
          className="calendar-wrapper flex justify-center"
          style={{ ['--selected-total' as any]: selectedTotal } as React.CSSProperties}
        >
          <Calendar
            locale={ko}
            formatters={{
              formatCaption: (month) => format(month, 'M월', { locale: ko }),
              formatWeekdayName: (date) => format(date, 'EEEEE', { locale: ko }),
            }}
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
            showOutsideDays={false}
            className="rounded-md mx-auto [--cell-size:46px]"
          />
        </div>
      </div>

      <div className="px-5 pt-3 text-sub-gray text-sm font-medium">
        {formatDateHeader(ymd)}
      </div>

      <div className="px-5 py-4">
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
              <div className="flex flex-col items-center justify-center min-h-[320px] text-center">
                <div className="mb-4 flex justify-center">
                  <img src={emptyImage} alt="빈 상태" className="w-[150px] h-[150px] object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-1">아직 내역이 없어요</h3>
                <p className="text-xs font-normal">
                  미분류 내역에서 분류를 진행하거나
                  <br />새로운 내역을 추가해주세요!
                </p>
              </div>
            ) : (
              <div className="space-y-3 pb-28">
                {expenses.map((expense) => (
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

      <button
        onClick={() => navigate('/expenses/add')}
        className="fixed bottom-6 right-6 w-10 h-10 bg-main-orange rounded-full shadow-lg hover:bg-main-orange/90 transition-colors flex items-center justify-center z-50"
        aria-label="지출 추가"
      >
        <PlusIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
