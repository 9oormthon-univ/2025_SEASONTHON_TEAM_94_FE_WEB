import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  backPath?: string;
}

export function Header({ title, onBackClick, backPath }: HeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white">
      <button
        onClick={handleBackClick}
        className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="justify-start text-black text-base font-bold">{title}</h1>
      <div className="w-8" /> {/* Spacer */}
    </div>
  );
}
