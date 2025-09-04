// features/reports/components/ReportSummary.tsx
import { Card, CardContent } from '@/shared/components/ui/card';
import Money from './Money';
import { dateK } from '../utils/date';
import { fmt } from '../utils/number';
import type { ReactNode } from 'react';
import ProgressBar from './ProgressBar';

type Props = {
  monthlyGoal: number;
  isOver: boolean;
  total: number;
  totalCount: number;
  monthOverCount: number;
  monthFixedCount: number;
  overSum: number;
  fixedSum: number;
  monthStart: Date;
  monthEnd: Date;
  today: Date;
  progressEl?: ReactNode;   
  barPercent?: number;
  showList?: boolean;
};

export default function ReportSummary({
  monthlyGoal, isOver, total, totalCount, monthOverCount, monthFixedCount,
  overSum, fixedSum, monthStart, monthEnd, today,
  barPercent,
  showList = true,
}: Props) {
  const hasGoal = monthlyGoal > 0;
  const ratio = hasGoal ? total / monthlyGoal : 0;

  const overPercentText = hasGoal ? Math.max(0, (ratio - 1) * 100).toFixed(2) : '0.00';
  const savingPercentText = hasGoal ? Math.max(0, 100 - Math.min(100, ratio * 100)).toFixed(2) : '0.00';

  const pct = hasGoal ? Math.max(0, Math.min(100, (total / monthlyGoal) * 100)) : 0;

  return (
    <>
      <Card className="mx-4 rounded-2xl border border-[#EBEBEB] shadow-sm">
        <CardContent className="p-4 space-y-4">
          {hasGoal ? (
            <div className="text-center">
              <p className="text-base md:text-lg font-semibold !text-[#002B5B]">
                {isOver ? '예산을 초과했어요.' : '예산을 초과하지 않았어요!'}
              </p>
              <p className="mt-1 text-xs md:text-sm text-[#757575]">
                {isOver ? (
                  <>
                    이번 달 목표보다{' '}
                    <span className="text-[#FF6200] font-bold">{overPercentText}%</span> 더 쓰고 있어요.
                  </>
                ) : (
                  <>
                    이번 달에{' '}
                    <span className="text-[#FF6200] font-bold">{savingPercentText}%</span>나 아끼고 있어요.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="!text-lg !font-semibold !text-[#002B5B]">목표 초과지출을 설정해 보세요.</p>
              <p className="mt-1 !text-sm !text-[#757575]">
                이번 달에 <span className="text-[#FF6200] font-light">얼마까지</span> 지출할 건가요?
              </p>
            </div>
          )}

          <div className="mt-2">
            {(() => {
              return (
                <ProgressBar
                  barPercent={pct}
                  percentCenterLeft={pct}
                  barLabel={`- ${fmt(Math.max(0, total))}`}
                  goalLabel={hasGoal ? `- ${fmt(monthlyGoal)}` : undefined}
                  isOver={isOver}
                />
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {showList && (
        <div className="mx-4 space-y-4 py-4">
          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#002B5B]">목표 초과지출</div>
              <div className="text-[11px] text-[#757575]">{`${dateK(monthStart)} - ${dateK(monthEnd)}`}</div>
            </div>
            <div className="mt-2 text-base font-bold text-[#FF6200]">
              <Money>
                {hasGoal ? (isOver ? `+ ${fmt(Math.max(0, total - monthlyGoal))}` : '- 0원') : '- 0원'}
              </Money>
            </div>
          </div>

          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#002B5B]">초과지출</div>
              <div className="text-[11px] text-[#757575]">
                {`${dateK(monthStart)} - ${dateK(today)} · ${monthOverCount}번 지출`}
              </div>
            </div>
            <div className="mt-2 text-base font-bold text-[#FF6200]">
              <Money>{`- ${fmt(overSum)}`}</Money>
            </div>
          </div>

          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#002B5B]">고정지출</div>
              <div className="text-[11px] text-[#757575]">
                {`${dateK(monthStart)} - ${dateK(monthEnd)} · ${monthFixedCount}번 지출`}
              </div>
            </div>
            <div className="mt-2 text-base font-bold text-[#757575]">
              <Money>{`- ${fmt(fixedSum)}`}</Money>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
