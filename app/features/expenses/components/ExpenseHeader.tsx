import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';

interface ExpenseHeaderProps {
  title: string;
  onBackClick?: () => void;
  backPath?: string;
}

export function ExpenseHeader({ title, onBackClick, backPath = '/expenses' }: ExpenseHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(backPath);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-6">
      <button
        onClick={handleBackClick}
        className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-base font-medium text-black tracking-[-0.165px]">
        {title}
      </h1>
      <div className="w-8" /> {/* Spacer */}
    </div>
  );
}
