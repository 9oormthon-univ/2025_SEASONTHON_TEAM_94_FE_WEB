import { motion } from 'motion/react';

interface Props {
  barPercent: number;
  percentCenterLeft: number;
  barLabel: string;
  isOver?: boolean;
  goalLabel?: string;
  themeColor?: string;
}

export default function ProgressBar({
  barPercent,
  percentCenterLeft,
  barLabel,
  isOver = false,
  goalLabel,
  themeColor = '#08B469',
}: Props) {
  const pct = Math.max(0, Math.min(100, barPercent));

  const EDGE_INSET_PX = 6;
  const isStart = pct <= 0.5;
  const isEnd = pct >= 99.5;
  const edgeAdjustPx = isEnd ? -EDGE_INSET_PX : isStart ? EDGE_INSET_PX : 0;

  return (
    <div className="relative">
      <motion.div
        className="absolute flex flex-col items-center select-none"
        style={{
          left: `calc(${pct}% + ${edgeAdjustPx}px)`,
          bottom: '130%',
          transform: 'translate(-50%, -10px)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2,
          ease: "easeOut"
        }}
      >
        <div className="text-sm font-semibold" style={{ color: themeColor }}>
          {pct === 0 || pct === 100 ? `${Math.round(pct)}%` : `${pct.toFixed(2)}%`}
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `7px solid ${themeColor}`,
            marginTop: 2,
          }}
        />
      </motion.div>

      <div className="mt-15 h-3 rounded-full bg-zinc-200 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: themeColor }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct+9}%` }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: 0.1
          }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[13px]">
        <div className="font-semibold" style={{ color: themeColor }}>{barLabel}</div>
        {goalLabel ? <div className="text-zinc-500">{goalLabel}</div> : <div />}
      </div>
    </div>
  );
}