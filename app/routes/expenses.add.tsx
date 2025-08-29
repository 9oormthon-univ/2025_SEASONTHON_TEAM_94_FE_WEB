import { useNavigate } from 'react-router';
import {
  ChevronDown,
  Calendar as CalendarIcon,
  ChevronLeft,
  Pencil,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';

import { cn } from '@/shared/utils/utils';
import { createTransaction } from '@/features/expenses/api/expenseApi';
import {
  EXPENSE_TYPES,
  type TransactionCreateRequest,
  type ExpenseType,
} from '@/shared/types/expense';
import { MOCK_USER_UID } from '@/shared/config/api';

export default function AddExpensePage() {
  const navigate = useNavigate();
  const [expenseType, setExpenseType] = useState<ExpenseType>(
    EXPENSE_TYPES.OVER_EXPENSE
  );
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [app, setApp] = useState<string>('신한은행 신용카드');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dutchPayCount, setDutchPayCount] = useState<number>(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setAmount(formattedValue);
    } else {
      setAmount('');
    }
  };

  const handleSave = async () => {
    if (!amount || !merchant) {
      alert('금액과 거래처를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 더치페이 적용된 실제 금액 계산
      const numericAmount = parseInt(amount.replace(/[^0-9]/g, '')) || 0;
      const finalAmount =
        dutchPayCount > 1
          ? Math.floor(numericAmount / dutchPayCount)
          : numericAmount;

      const transactionData: TransactionCreateRequest = {
        price: finalAmount,
        startAt: selectedDate.toISOString(),
        title: merchant,
        userUid: MOCK_USER_UID,
      };

      await createTransaction(transactionData);

      // 성공 시 지출 목록으로 이동
      navigate('/expenses');
    } catch (error) {
      console.error('지출 저장 실패:', error);
      alert('지출 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen max-w-md mx-2 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
        <div
          onClick={() => navigate('/expenses')}
          className="p-0 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </div>
        <h1 className="text-[15px] font-medium text-black tracking-[-0.165px]">
          지출 추가
        </h1>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Type Selection with Custom Tabs */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="bg-[#e6e6e6] rounded-[10px] h-[45px] flex p-1 relative">
          {/* Active Tab Background */}
          <div
            className={cn(
              'absolute top-1 h-[37px] w-1/2 bg-[#ff6200] rounded-[8px] transition-all duration-300 ease-in-out shadow-sm',
              expenseType === EXPENSE_TYPES.FIXED_EXPENSE
                ? 'translate-x-full'
                : 'translate-x-0'
            )}
          />

          {/* Tab Buttons */}
          <button
            onClick={() => setExpenseType(EXPENSE_TYPES.OVER_EXPENSE)}
            className={cn(
              'relative z-10 flex-1 h-[37px] rounded-[8px] flex items-center justify-center text-[16px] font-bold transition-colors duration-300',
              expenseType === EXPENSE_TYPES.OVER_EXPENSE
                ? 'text-white'
                : 'text-gray-600'
            )}
          >
            초과지출
          </button>
          <button
            onClick={() => setExpenseType(EXPENSE_TYPES.FIXED_EXPENSE)}
            className={cn(
              'relative z-10 flex-1 h-[37px] rounded-[8px] flex items-center justify-center text-[16px] font-bold transition-colors duration-300',
              expenseType === EXPENSE_TYPES.FIXED_EXPENSE
                ? 'text-white'
                : 'text-gray-600'
            )}
          >
            고정지출
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              type="text"
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
            onChange={e => setMerchant(e.target.value)}
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
            onChange={e => setApp(e.target.value)}
            placeholder="앱을 선택하세요"
            className="!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none flex-1 ml-4 !p-0 !h-auto"
          />
        </div>

        {/* Date */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-base text-[#757575] tracking-[-0.176px]">
            날짜
          </label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
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
                    setSelectedDate(date);
                    setIsDatePickerOpen(false);
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
              type="text"
              value={dutchPayCount || ''}
              onChange={e => {
                const value = e.target.value;
                // 숫자만 허용하고 앞자리 0 제거
                const numericValue = value.replace(/[^0-9]/g, '');
                const parsedValue =
                  numericValue === '' ? 0 : parseInt(numericValue, 10);
                setDutchPayCount(parsedValue);
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

      {/* Action Buttons */}
      <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 px-4 sm:px-6 max-w-md mx-auto">
        <div className="flex">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 h-[45px] bg-[#002b5b] text-white text-[15px] font-medium rounded-[10px] hover:bg-[#002b5b]/90 disabled:opacity-50"
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
