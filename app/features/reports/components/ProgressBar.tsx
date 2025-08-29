// features/reports/components/ProgressBar.tsx
import { Progress } from '@/shared/components/ui/progress';

interface Props {
  barPercent: number;        // 0~100
  percentCenterLeft: number; 
  barLabel: string;          
}

export default function ProgressBar({
  barPercent,
  percentCenterLeft,
  barLabel,
}: Props) {
  const pct = Math.max(0, Math.min(100, barPercent));

  const EDGE_INSET_PX = 6;
  const isStart = pct <= 0.5;
  const isEnd   = pct >= 99.5;
  const edgeAdjustPx = isEnd ? -EDGE_INSET_PX : isStart ? EDGE_INSET_PX : 0;
  const labelTx = isStart ? '50%' : isEnd ? '-50%' : '0%';

  return (
    <div className="relative pt-7">
      {/* 바 자체는 shadcn/ui Progress로 */}
      <Progress value={pct} className="h-10 rounded-md" />

      {/* 중앙 퍼센트 텍스트 (채워진 바의 정중앙) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-white"
        style={{ left: `calc(${percentCenterLeft}% )`, transform: 'translate(-50%,+70%)' }}
      >
        {pct === 0 || pct === 100 ? `${pct}%` : `${pct.toFixed(2)}%`}
      </div>

      {/* 라벨 + 마커 (위쪽에 띄우기) */}
      <div
        className="absolute flex flex-col items-center pointer-events-none z-10"
        style={{
          left: `calc(${pct}% + ${edgeAdjustPx}px)`,
          bottom: '100%',
          transform: 'translate(-50%, 30px)',
        }}
      >
        <div
          className="mb-1 whitespace-nowrap text-[11px] font-bold text-[#FF6200]"
          style={{ transform: `translateX(${labelTx})` }}
        >
          {barLabel}
        </div>
        <div className="w-[4px] h-[4px] rounded-full bg-black" />
        <div className="w-px h-3 bg-black" />
      </div>
    </div>
  );
}
