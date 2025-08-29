import { Card, CardContent } from '@/shared/components/ui/card';
import ProgressBar from '@/features/reports/components/ProgressBar';
import Money from '@/features/reports/components/Money';
import { Link } from 'react-router-dom';

type Props = {
  title?: string;
  barPercent: number;
  percentCenterLeft: number;
  barLabel: string;
  monthlyGoal: number;
  className?: string;
  setGoalTo?: string;
};

export default function MiniReport({
  title = '초과지출',
  barPercent,
  percentCenterLeft,
  barLabel,
  monthlyGoal,
  className,
  setGoalTo = '/report',
}: Props) {
  return (
    <Card className={`mx-4 mt-4 rounded-lg border-0 shadow-none ${className ?? ''}`}>
      <CardContent className="p-4 h-full">
        <div className="text-center text-[15px] font-semibold text-[#002B5B]">{title}</div>

        <div className="mt-3">
          <ProgressBar
            barPercent={barPercent}
            percentCenterLeft={percentCenterLeft}
            barLabel={barLabel}
          />
        </div>

        {/* 아래 줄: 중앙 링크 + 우측 목표 금액 */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#757575]">
          <Link to={setGoalTo} className="mx-auto text-[#BDBDBD] hover:underline underline-offset-2">
            목표 초과지출 설정
          </Link>
          <Money>{monthlyGoal > 0 ? `- ${monthlyGoal.toLocaleString()}원` : '0원'}</Money>
        </div>
      </CardContent>
    </Card>
  );
}
