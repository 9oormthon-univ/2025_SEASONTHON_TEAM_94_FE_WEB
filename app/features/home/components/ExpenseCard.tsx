import { Card, CardContent } from '@/shared/components/ui/card';
import Money from '@/features/reports/components/Money';
import { fmt } from '@/features/reports/utils/number';
import { ChevronRight } from 'lucide-react';

type Props = {
  total: number;                 
  onOpenExpenses: () => void;
};

export default function ExpenseCard({ total, onOpenExpenses }: Props) {
  return (
    <Card className="rounded-2xl border border-[#EBEBEB]">
      <CardContent className="p-5 min-h-[110px] flex flex-col justify-center">
        <div className="text-sm text-[#111111] font-medium">지출</div>
        <button className="mt-2 w-full flex items-center justify-between" onClick={onOpenExpenses}>
          <div className="text-xl font-bold text-[#111111]">
            <Money>- {fmt(total)}</Money>
          </div>
          <ChevronRight className="w-5 h-5 text-[#B9B9B9]" />
        </button>
      </CardContent>
    </Card>
  );
}
