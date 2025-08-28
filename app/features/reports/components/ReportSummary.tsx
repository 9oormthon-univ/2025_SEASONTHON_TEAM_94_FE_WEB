// features/reports/components/ReportSummary.tsx
import { Card, CardContent } from '@/shared/components/ui/card';
import Money from './Money';
import { dateK } from '../utils/date';
import { fmt } from '../utils/number';
import type { ReactNode } from 'react';

type Props = {
  monthlyGoal: number;
  isOver: boolean;
  total: number;
  monthOverCount: number;
  monthFixedCount: number;
  overSum: number;
  fixedSum: number;
  monthStart: Date;
  monthEnd: Date;
  today: Date;
  progressEl: ReactNode;
  barPercent?: number;
  showList?: boolean;
};

export default function ReportSummary({
  monthlyGoal, isOver, total, monthOverCount, monthFixedCount,
  overSum, fixedSum, monthStart, monthEnd, today, progressEl,
  barPercent,
  showList = true,
}: Props) {
  const isFull = barPercent === 100;

  return (
    <>
      {/* 상단 카드 */}
      <Card className="mx-4 rounded-2xl border border-[#EBEBEB] shadow-sm">
        <CardContent className="p-4 space-y-4">
          {monthlyGoal > 0 ? (
            <div className="text-center">
              {/* 네이비보다 설명이 작도록: 제목을 한 단계 크게 */}
              <p className="text-base md:text-lg font-semibold !text-[#002B5B]">
                {isOver ? '예산을 초과했어요.' : '예산을 초과하지 않았어요!'}
              </p>
              <p className="mt-1 text-xs md:text-sm text-[#757575]">
                {isOver ? (
                  <>
                    이번 달에 목표보다{' '}
                    <span className="text-[#FF6200] font-bold">
                      {((total / monthlyGoal - 1) * 100).toFixed(2)}%
                    </span>{' '}
                    더 쓰고 있어요.
                  </>
                ) : (
                  <>
                    목표 대비{' '}
                    <span className="text-[#FF6200] font-bold">
                      {(
                        100 -
                        Math.min(100, Math.max(0, (total / monthlyGoal) * 100))
                      ).toFixed(2)}
                      %
                    </span>{' '}
                    아끼고 있어요.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="text-center">
              {/* 네이비 제목을 더 크고 굵게 */}
              <p className="!text-lg !font-semibold !text-[#002B5B]">
                목표 초과지출을 설정해 보세요.
              </p>

              {/* 바가 100%가 아닐 때 '얼마까지'만 주황색으로 강조 */}
              <p className="mt-1 !text-sm !text-[#757575]">
                이번 달에{' '}
                <span className="text-[#FF6200] font-light">
                    얼마까지
                </span>{' '}
                지출할 건가요?
              </p>
            </div>
          )}

          {progressEl}

          <div className="mt-1 flex justify-between text-[11px] text-[#757575]">
            <span />
            <Money>{monthlyGoal > 0 ? `- ${fmt(monthlyGoal)}` : '0원'}</Money>
          </div>
        </CardContent>
      </Card>

      {/* 리스트는 옵션 */}
      {showList && (
        <div className="mx-4 space-y-4 py-4">
          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#002B5B]">목표 초과지출</div>
              <div className="text-[11px] text-[#757575]">{`${dateK(monthStart)} - ${dateK(monthEnd)}`}</div>
            </div>
            <div className="mt-2 text-base font-bold text-[#FF6200]">
              <Money>{monthlyGoal > 0 ? (isOver ? `+ ${fmt(total - monthlyGoal)}` : `- 0원`) : '- 0원'}</Money>
            </div>
          </div>

          <div className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#002B5B]">초과지출</div>
              <div className="text-[11px] text-[#757575]">{`${dateK(monthStart)} - ${dateK(today)} · ${monthOverCount}번 지출`}</div>
            </div>
            <div className="mt-2 text-base font-bold text-[#FF6200]">
              <Money>{`- ${fmt(overSum)}`}</Money>
            </div>
          </div>

          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#002B5B]">고정지출</div>
              <div className="text-[11px] text-[#757575]">{`${dateK(monthStart)} - ${dateK(monthEnd)} · ${monthFixedCount}번 지출`}</div>
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
