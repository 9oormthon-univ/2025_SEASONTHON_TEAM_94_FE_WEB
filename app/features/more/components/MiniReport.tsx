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
  setGoalTo = '/reports/budget-goal',
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

        <div className="mt-2 text-[11px]">
          <div className="mt-1 flex justify-end text-[#757575]">
            <Money>{monthlyGoal > 0 ? `- ${monthlyGoal.toLocaleString()}원` : '0원'}</Money>
          </div>

          <div className="flex justify-center">
            <Link
              to={setGoalTo}
              className="text-[#757575] underline underline-offset-4 decoration-[#BDBDBD] hover:decoration-[#757575]"
            >
              목표 초과지출 설정
            </Link>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
