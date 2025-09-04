import { Button } from '@/shared/components/ui/button';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function NumberStepper({ 
  value, 
  onChange, 
  min = 1, 
  max = 20,
  className = ""
}: NumberStepperProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

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
