import { Button } from '@/shared/components/ui/button';
import { useCallback } from 'react';
import { toast } from 'sonner';

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
  className = "",
  price = 0
}: NumberStepperProps) {
  const handleIncrement = useCallback(() => {
    // 더치페이 증가 시 금액이 100원 미만인지 확인
    if (value === 1 && price < 100) {
      toast.info("더치페이는 금액 100원 이상부터 가능해요");
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
      <div className="flex items-center justify-center min-w-[60px] h-8 text-center text-[16px] text-[#3d3d3d] font-medium">
        {value}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-8 w-8 border-[#BFBFBF] hover:bg-gray-50 disabled:opacity-30"
      >
        <img 
          src="/app/assets/Chevron_up.svg" 
          alt="증가" 
          className="w-4 h-4"
        />
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-8 w-8 border-[#BFBFBF] hover:bg-gray-50 disabled:opacity-30"
      >
        <img 
          src="/app/assets/Chevron_down.svg" 
          alt="감소" 
          className="w-4 h-4"
        />
      </Button>
    </div>
  );
}
