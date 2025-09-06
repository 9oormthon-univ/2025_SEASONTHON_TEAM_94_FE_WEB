import { Button } from '@/shared/components/ui/button';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import ChevronUp from '@/assets/Chevron_up.svg?react';
import ChevronDown from '@/assets/Chevron_down.svg?react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  price?: number;
}

export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  className = '',
  price = 0,
}: NumberStepperProps) {
  const handleIncrement = useCallback(() => {
    // 더치페이 증가 시 금액이 100원 미만인지 확인
    if (value === 1 && price < 100) {
      toast.info('더치페이는 금액 100원 이상부터 가능해요');
      return;
    }

    if (value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange, price]);

  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div 
        className="flex items-center justify-center min-w-[60px] h-8 text-center text-[16px] text-gray-700 font-medium"
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: 0.2 
        }}
      >
        {value}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-8 w-8 border-sub-gray hover:bg-gray-50 disabled:opacity-30"
        >
          <motion.div
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronUp />
          </motion.div>
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-8 w-8 border-sub-gray hover:bg-gray-50 disabled:opacity-30"
        >
          <motion.div
            whileHover={{ y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronDown />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
