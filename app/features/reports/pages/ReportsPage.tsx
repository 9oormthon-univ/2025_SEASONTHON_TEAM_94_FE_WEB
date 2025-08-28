// features/reports/pages/ReportPage.tsx
import { useNavigate } from 'react-router-dom';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import ProgressBar from '../components/ProgressBar';
import ReportSummary from '../components/ReportSummary';
import { useReport } from '../hooks/useReport';
import { fmt } from '../utils/number';
import { dateK } from '../utils/date';

export default function ReportPage() {
  const navigate = useNavigate();
  const {
    ym, today, monthStart, monthEnd,
    monthOver, monthFixed, overSum, fixedSum, total,
    monthlyGoal, barPercent, percentCenterLeft, barLabel, markerLeft, labelTransform, isOver,
  } = useReport();

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto pb-20">
      <ExpenseHeader />

      {/* 상단 지출분석: 회색 배경 + 카드만 */}
      <section className="bg-[#F5F5F5] py-4">
      <div className="px-4 pt-2 pb-3">
        {/* 날짜 + 아이콘 (아이콘만 클릭 가능) */}
        <div className="flex items-center gap-1 text-sm text-[#757575]">
          <span>{`${ym.m}월 ${ym.d}일`}</span>
          <button
            type="button"
            aria-label="날짜 선택"
            className="p-1 -m-1 rounded outline-none hover:bg-black/5 active:bg-black/10"
            onClick={() => {
              // 👉 여기서 드롭다운/바텀시트 열기
              // openMonthPicker(true)
            }}
          >
            {/* chevron-down 아이콘 */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <h2 className="mt-1 text-xl font-extrabold !text-[#002B5B]">
          여울 님의 지출분석
        </h2>
      </div>

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
            markerLeft={markerLeft}
            labelTransform={labelTransform}
          />
        }
      />
    </section>

      <div className="bg-white px-4 pt-4 pb-24 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-[#002B5B]">목표 초과지출</div>
            <div className="text-[11px] text-[#757575]">
              {`${dateK(monthStart)} - ${dateK(monthEnd)}`}
            </div>
          </div>
          <div className="mt-2 text-xl font-medium text-[#FF6200]">
            {monthlyGoal > 0 ? (isOver ? `+ ${fmt(total - monthlyGoal)}` : `- 0원`) : '- 0원'}
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
          <button type="button" onClick={() => navigate('/')}
            className="
              mx-auto                 /* 가운데 정렬 */
              !w-[364px] max-w-full   /* 고정폭(364px), 부모보다 크면 줄이기 */
              !h-[45px]               /* 높이 고정 */
              !rounded-[8px]          /* 모서리 8px */
              !px-[10px] !py-[10px]    /* 패딩 10px */
              !flex items-center !justify-center gap-[10px] /* 아이콘/텍스트 간격 10px */
              !font-light !text-white text-center
              shadow-md active:shadow-sm
              appearance-none
              !bg-[#FF6200] hover:opacity-90 disabled:opacity-100
            "
          >
            {monthlyGoal > 0 ? '목표 지출 설정하기' : '목표 지출 설정하기'}
          </button>
        </div>

      </div>
    </div>
  );
}
