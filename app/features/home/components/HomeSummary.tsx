import { Card, CardContent } from '@/shared/components/ui/card';
import Money from '@/features/reports/components/Money';
import ProgressBar from '@/features/reports/components/ProgressBar';
import ExpenseCard from './ExpenseCard';
import { fmt } from '@/features/reports/utils/number';
import { ChevronRight } from 'lucide-react';
import type { HomeState } from '../hooks/useHome';
import { motion } from 'motion/react';
import PencilIcon from '@/assets/pencil.svg?react';

type Props = {
  userName: string;
  total: number;
  totalCount: number;
  monthlyGoal: number;
  leftToGoal: number;
  ratio: number;
  isOver: boolean;
  hasGoal: boolean;
  hasExpense: boolean;
  monthStart: Date;
  monthEnd: Date;
  onOpenExpenses: () => void;
  onOpenFixed: () => void;
  onEditGoal: () => void;
  onOpenReport?: () => void;
};

function StatusBanner({
  state,
  savedPercent,
}: {
  state: HomeState;
  savedPercent: number;
}) {
  if (state === 'OVER') {
    return (
      <Card className="rounded-2xl bg-[#EF4444] text-white">
        <CardContent className="p-5 text-base">
          <div className="text-[#FFFEFB] text-base font-bold">
            목표지출을 초과했어요
          </div>
          <div className="mt-0.5 opacity-90 text-[#FFFEFB] text-xs font-medium">
            꼭 필요한 지출만 관리해보세요
          </div>
        </CardContent>
      </Card>
    );
  }
  if (state === 'NO_GOAL_HAS_EXPENSE') {
    return (
      <Card className="rounded-2xl bg-[#757575] text-white">
        <CardContent className="p-5 text-base">
          <div className="text-[#FFFEFB] text-base font-bold">
            아직 목표지출이 없어요
          </div>
          <div className="mt-0.5 opacity-90 text-[#FFFEFB] text-xs font-medium">
            이번달 목표를 세워보세요
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl bg-[#10B981] text-white border-0 shadow-none">
      <CardContent className="p-4 text-base">
        <div className="text-[#FFFEFB] text-base font-bold">
          목표지출을 초과하지 않았어요
        </div>
        <div className="mt-0.5 opacity-90 text-[#FFFEFB] text-xs font-medium">
          {savedPercent}%나 아끼고 있어요
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomeSummary(props: Props) {
  const {
    userName,
    total,
    totalCount,
    monthlyGoal,
    leftToGoal,
    ratio,
    isOver,
    hasGoal,
    hasExpense,
    monthStart,
    monthEnd,
    onOpenExpenses,
    onOpenFixed,
    onEditGoal,
    onOpenReport,
  } = props;

  const state: HomeState =
    !hasGoal && hasExpense
      ? 'NO_GOAL_HAS_EXPENSE'
      : !hasExpense && hasGoal
      ? 'NO_EXPENSE_HAS_GOAL'
      : !hasExpense && !hasGoal
      ? 'EMPTY'
      : isOver
      ? 'OVER'
      : 'NORMAL';

  const themeColor =
    state === 'OVER'
      ? '#EF4444'
      : state === 'NO_GOAL_HAS_EXPENSE'
      ? '#757575'
      : '#10B981';

  const savedPercentRaw = 100 - (hasGoal ? ratio : 0);
  const savedPercent =
    savedPercentRaw === 0 || savedPercentRaw === 100
      ? Math.round(savedPercentRaw)
      : parseFloat(savedPercentRaw.toFixed(2));

  return (
    <div className="mt-3 space-y-2">
      <ExpenseCard total={total} onOpenExpenses={onOpenExpenses} />

      <Card className="rounded-2xl border-0 shadow-none">
        <CardContent className="p-5 min-h-[95px] flex flex-col justify-center">
          <div className="text-base text-sub-gray font-medium">
            목표 지출까지 남은 금액
          </div>
          <div className="mt-1 text-base font-bold text-main-orange">
            {hasGoal ? <Money>{fmt(leftToGoal)}</Money> : <Money>0원</Money>}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 shadow-none">
        <CardContent className="p-5 min-h-[174px]">
          <div className="flex items-center justify-between">
            <div className="text-base font-medium text-gray-600">목표 지출</div>

            <div className="flex items-center gap-1">
              {hasGoal && (
                <div className="text-base text-gray-900 font-medium whitespace-nowrap">
                  <Money>- {fmt(monthlyGoal)}</Money>
                </div>
              )}
              <button
                type="button"
                className="p-1 text-gray-600"
                onClick={onEditGoal}
                aria-label="목표 지출 수정"
              >
                <PencilIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-2">
            <ProgressBar
              barPercent={hasGoal ? ratio : 0}
              percentCenterLeft={hasGoal ? ratio : 0}
              barLabel={hasGoal ? `- ${fmt(Math.max(0, total))}` : '- 0원'}
              goalLabel={undefined}
              isOver={isOver}
              themeColor={themeColor}
            />
          </div>
        </CardContent>
      </Card>

      <StatusBanner state={state} savedPercent={savedPercent} />

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card className="rounded-2xl mb-1 cursor-pointer border-0 shadow-none">
          <CardContent
            className="p-5 min-h-[110px] flex items-center justify-between"
            onClick={onOpenFixed}
          >
            <div>
              <div className="text-base font-medium text-sub-gray">
                고정지출
              </div>
              <div className="mt-1 text-base font-bold text-gray-900">
                <Money>- {fmt(total)}</Money>
              </div>
            </div>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
