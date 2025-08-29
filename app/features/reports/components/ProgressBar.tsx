// features/reports/components/ProgressBar.tsx
interface Props {
  barPercent: number;
  percentCenterLeft: number;
  barLabel: string;      // "- 114,900원" 등
}

export default function ProgressBar({
  barPercent,
  percentCenterLeft,
  barLabel,
}: Props) {
  const pct = Math.max(0, Math.min(100, barPercent));

  // 100%에서 둥근 코너 때문에 떠 보이는 걸 방지하는 인셋(px)
  const EDGE_INSET_PX = 6;   // ← 필요하면 4~8 사이로 미세 조정
  const START_EPS = 0.5;     // 0%로 간주
  const END_EPS   = 99.5;    // 100%로 간주

  const isStart = pct <= START_EPS;
  const isEnd   = pct >= END_EPS;

  // 퍼센트 위치 + 0/100 보정(px)
  const edgeAdjustPx = isEnd ? -EDGE_INSET_PX : isStart ? EDGE_INSET_PX : 0;

  // 라벨 정렬: 컨테이너가 중심(마커)에 맞춰져 있으므로
  // 0%  -> 라벨을 오른쪽으로 50% (왼쪽끝이 마커 위)
  // 100%-> 라벨을 왼쪽으로 50% (오른쪽끝이 마커 위)
  // 그외 -> 가운데(0%)
  const labelTx = isStart ? '50%' : isEnd ? '-50%' : '0%';

  return (
    <div className="relative pt-7">
      <div className="relative h-10 w-full rounded-lg border border-[#BFBFBF] bg-[#F4F6F8] overflow-visible">
        {/* 채워진 바 */}
        <div
          className={`h-full ${pct >= 100 ? 'rounded-lg' : 'rounded-l-lg'}`}
          style={{ width: `${pct}%`, background: '#002B5B' }}
        />

        {/* 퍼센트 중앙 텍스트 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 text-white text-xs font-normal"
          style={{ left: `calc(${percentCenterLeft}% )`, transform: 'translate(-50%,-20%)' }}
        >
          {pct === 0 || pct === 100 ? `${pct}%` : `${pct.toFixed(2)}%`}
        </div>

        {/* ✅ 마커 그룹(라벨+점+선): 퍼센트 지점 '가운데'에 정렬 */}
        <div
          className="absolute flex flex-col items-center pointer-events-none z-10"
          style={{
            left: `calc(${pct}% + ${edgeAdjustPx}px)`,
            bottom: '100%',                 // 바 윗변 기준
            transform: 'translate(-50%, 1px)', // X: 가운데, Y: 1px 내려 바에 닿게
          }}
        >
          {/* 라벨: 위에서 정한 규칙대로만 X 이동 */}
          <div
            className="mb-1 whitespace-nowrap text-[11px] font-bold text-[#FF6200]"
            style={{ transform: `translateX(${labelTx})` }}
          >
            {barLabel}
          </div>

          {/* 마커(점+세로선) */}
          <div className="w-[4px] h-[4px] rounded-full bg-black" />
          <div className="w-px h-3 bg-black" />
        </div>
      </div>
    </div>
  );
}
