// features/reports/components/ProgressBar.tsx
interface Props {
  barPercent: number;
  percentCenterLeft: number;
  barLabel: string;     // 예: "- 0원", "+ 114,900원"
  markerLeft: number;   // 0~100
  labelTransform: string; // <-- 더 이상 쓰지 않아도 됨(남겨둬도 무방)
}

export default function ProgressBar({
  barPercent,
  percentCenterLeft,
  barLabel,
  markerLeft,
}: Props) {
  return (
    <div className="relative pt-7">
      <div className="h-10 w-full rounded-lg border border-[#BFBFBF] bg-[#F4F6F8] overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${barPercent}%`, background: '#002B5B' }}
        />
      </div>

      {/* 퍼센트 중앙 표시 */}
      <div
        className="absolute bottom-[15px] text-white text-xs font-normal"
        style={{ left: `calc(${percentCenterLeft}% )`, transform: 'translateX(-50%)' }}
        >
        {barPercent === 0 || barPercent === 100
            ? `${barPercent}%`
            : `${barPercent.toFixed(2)}%`}
        </div>


      {/* 마커 + 라벨 */}
      <div
        className="absolute flex flex-col items-center pointer-events-none z-10"
        style={{ left: `calc(${markerLeft}% )`, bottom: '32px' }}
      >
        {/* 👉 라벨의 '오른쪽 끝'이 마커 위치에 오도록 translateX(-100%) */}
        <div
          className="text-[11px] font-bold text-[#FF6200] whitespace-nowrap mb-1 text-right"
          style={{ transform: 'translateX(-50%)' }}
        >
          {barLabel}
        </div>

        {/* 점 + 세로선 (마커) */}
        <div className="w-[4px] h-[4px] rounded-full bg-black" />
        <div className="w-[1px] h-4 bg-black" />
      </div>
    </div>
  );
}
