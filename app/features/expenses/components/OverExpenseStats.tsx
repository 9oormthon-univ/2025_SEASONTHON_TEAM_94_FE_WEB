import { Badge } from '@/shared/components/ui/badge';

interface OverExpenseStatsProps {
  totalCount: number;
  totalAmount: number;
}

export function OverExpenseStats({
  totalCount,
  totalAmount,
}: OverExpenseStatsProps) {
  return (
    <div className="px-5 py-2 bg-white">
      <div className="rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="justify-start text-xl font-bold">초과지출</div>
            <Badge
              variant="outline"
              className="rounded-sm h-5 px-2 justify-start text-[#10B981] text-xs font-bold border-[#10B981]"
            >
              {totalCount}건
            </Badge>
          </div>
          <div className="justify-center text-main-orange text-2xl font-bold">
            -{totalAmount.toLocaleString()}원
          </div>
        </div>
        <div className="self-stretch h-4 justify-start text-sub-gray text-base font-normal">
          이제 차근차근 줄여보세요
        </div>
      </div>
    </div>
  );
}
