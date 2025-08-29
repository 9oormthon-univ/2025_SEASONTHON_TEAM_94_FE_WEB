import {
  ChevronDown,
  Pencil,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/utils/utils';
import type { ExpenseFormProps } from '@/features/expenses/_lib/types/components';

export function ExpenseForm({
  formData,
  onFormDataChange,
  isDatePickerOpen,
  onDatePickerOpenChange,
}: ExpenseFormProps) {
  const { amount, merchant, app, selectedDate, dutchPayCount } = formData;

  const formatDate = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 | ${hours}:${minutes}`;
  };

  const calculateDutchPayAmount = () => {
    if (dutchPayCount <= 1 || !amount) return amount;
    const totalAmount = parseInt(amount.replace(/[^0-9]/g, '')) || 0;
    return Math.floor(totalAmount / dutchPayCount).toLocaleString();
  };

  const handleAmountChange = (value: string) => {
    // 숫자만 허용하고 천 단위 구분자 추가
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue) {
      const formattedValue = parseInt(numericValue).toLocaleString();
      onFormDataChange({ amount: formattedValue });
    } else {
      onFormDataChange({ amount: '' });
    }
  };

  return (
    <>
      {/* Amount Input */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              type="number"
              inputMode='numeric'
              value={amount ? `-${amount}원` : ''}
              onChange={e => {
                const value = e.target.value.replace(/[-원]/g, '');
                handleAmountChange(value);
              }}
              placeholder="금액을 입력하세요"
              className="!text-2xl !font-bold !text-black !bg-transparent !border-none !outline-none !shadow-none !p-0 !h-auto"
              style={{ fontSize: '1.5rem' }}
            />
          </div>
          <Pencil className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="px-4 sm:px-6 space-y-6">
        {/* Merchant */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-[16px] text-[#757575] tracking-[-0.176px] flex-shrink-0">
            거래처
          </label>
          <Input
            type="text"
            value={merchant}
            onChange={e => onFormDataChange({ merchant: e.target.value })}
            placeholder="거래처를 입력하세요."
            className="!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none flex-1 ml-4 !p-0 !h-auto"
          />
        </div>

        {/* App */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-base text-[#757575] tracking-[-0.176px] flex-shrink-0">
            앱
          </label>
          <Input
            type="text"
            value={app}
            onChange={e => onFormDataChange({ app: e.target.value })}
            placeholder="앱을 선택하세요"
            className="!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none flex-1 ml-4 !p-0 !h-auto"
          />
        </div>

        {/* Date */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-base text-[#757575] tracking-[-0.176px]">
            날짜
          </label>
          <Popover open={isDatePickerOpen} onOpenChange={onDatePickerOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="text-base text-[#3d3d3d] text-right tracking-[-0.176px] p-0 h-auto font-normal"
              >
                {formatDate(selectedDate)}
                <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 max-w-[260px] sm:max-w-[300px]"
              align="center"
              side="top"
              sideOffset={8}
              avoidCollisions={true}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={date => {
                  if (date) {
                    onFormDataChange({ selectedDate: date });
                    onDatePickerOpenChange(false);
                  }
                }}
                captionLayout="dropdown"
                className="rounded-md border shadow-lg text-sm"
                classNames={{
                  months:
                    'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4',
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-medium',
                  nav: 'space-x-1 flex items-center',
                  nav_button:
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  nav_button_previous: 'absolute left-1',
                  nav_button_next: 'absolute right-1',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell:
                    'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                  row: 'flex w-full mt-2',
                  cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                  day: 'h-7 w-7 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground',
                  day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                  day_today: 'bg-accent text-accent-foreground',
                  day_outside: 'text-muted-foreground opacity-50',
                  day_disabled: 'text-muted-foreground opacity-50',
                  day_range_middle:
                    'aria-selected:bg-accent aria-selected:text-accent-foreground',
                  day_hidden: 'invisible',
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Dutch Pay */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-[16px] text-[#757575] tracking-[-0.176px] flex-shrink-0">
            더치페이
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode='numeric'
              value={dutchPayCount || ''}
              onChange={e => {
                const value = e.target.value;
                const numericValue = value.replace(/[^0-9]/g, '');
                const parsedValue =
                  numericValue === '' ? 0 : parseInt(numericValue, 10);
                onFormDataChange({ dutchPayCount: parsedValue });
              }}
              placeholder="0"
              className="!w-[55px] !h-[44px] !text-center !text-[16px] !text-[#3d3d3d] !font-medium"
            />
            {dutchPayCount > 1 && amount && (
              <div className="text-sm text-[#757575]">
                (1인당: {calculateDutchPayAmount()}원)
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
