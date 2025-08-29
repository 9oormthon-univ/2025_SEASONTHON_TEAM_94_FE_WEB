import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { EXPENSE_TYPES } from '@/shared/types/expense';
import { expenseFormSchema, type ExpenseFormData } from '@/features/expenses/utils/validation';
import type { ExpenseHookFormProps } from '@/features/expenses/_lib/types/components';

interface ExpenseFormProps extends ExpenseHookFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  defaultValues?: Partial<ExpenseFormData>;
}

export function ExpenseForm({
  onSubmit,
  defaultValues,
}: ExpenseFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      price: 0,
      title: '',
      userUid: '',
      selectedDate: new Date(),
      dutchPayCount: 1,
      app: '',
      category: undefined,
      ...defaultValues,
      // type이 항상 정의되도록 보장
      type: defaultValues?.type ?? EXPENSE_TYPES.OVER_EXPENSE,
    },
  });

  const watchedValues = watch();
  const { selectedDate, dutchPayCount, price, type } = watchedValues;

  const formatDate = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 | ${hours}:${minutes}`;
  };

  const calculateDutchPayAmount = () => {
    if (dutchPayCount <= 1 || !price) return price.toLocaleString();
    return Math.floor(price / dutchPayCount).toLocaleString();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[-원,]/g, '');
    const numericValue = parseInt(value) || 0;
    return numericValue;
  };

  // 디버깅용: type 값 변경 시 로그 출력
  console.log('🔍 [ExpenseForm] 현재 type 값:', type);

  const handleFormSubmit = (data: ExpenseFormData) => {
    console.log('🔍 [ExpenseForm] 폼 제출 시 type 값:', data.type);
    console.log('🔍 [ExpenseForm] 전체 폼 데이터:', data);
    onSubmit(data);
  };

  return (
    <form id="expense-form" onSubmit={handleSubmit(onSubmit as any)}>
      {/* Expense Type Selector */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="bg-[#e6e6e6] rounded-[10px] h-[45px] flex p-1 relative">
              {/* Active Tab Background */}
              <div
                className={cn(
                  'absolute top-1 h-[37px] w-1/2 bg-[#ff6200] rounded-[8px] transition-all duration-300 ease-in-out shadow-sm',
                  field.value === EXPENSE_TYPES.FIXED_EXPENSE
                    ? 'translate-x-full'
                    : 'translate-x-0'
                )}
              />

              {/* Tab Buttons */}
              <button
                type="button"
                onClick={() => field.onChange(EXPENSE_TYPES.OVER_EXPENSE)}
                className={cn(
                  'relative z-10 flex-1 h-[37px] rounded-[8px] flex items-center justify-center text-[16px] font-bold transition-colors duration-300',
                  field.value === EXPENSE_TYPES.OVER_EXPENSE
                    ? 'text-white'
                    : 'text-gray-600'
                )}
              >
                초과지출
              </button>
              <button
                type="button"
                onClick={() => field.onChange(EXPENSE_TYPES.FIXED_EXPENSE)}
                className={cn(
                  'relative z-10 flex-1 h-[37px] rounded-[8px] flex items-center justify-center text-[16px] font-bold transition-colors duration-300',
                  field.value === EXPENSE_TYPES.FIXED_EXPENSE
                    ? 'text-white'
                    : 'text-gray-600'
                )}
              >
                고정지출
              </button>
            </div>
          )}
        />
        {errors.type && (
          <p className="text-red-500 text-xs mt-2 text-center">{errors.type.message}</p>
        )}
      </div>

      {/* Amount Input */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  value={field.value ? `-${field.value.toLocaleString()}원` : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[-원,]/g, '');
                    const numericValue = parseInt(value) || 0;
                    field.onChange(numericValue);
                  }}
                  placeholder="금액을 입력하세요"
                  className="!text-2xl !font-bold !text-black !bg-transparent !border-none !outline-none !shadow-none !p-0 !h-auto"
                  style={{ fontSize: '1.5rem' }}
                />
              )}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
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
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                placeholder="거래처를 입력하세요."
                className="!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none flex-1 ml-4 !p-0 !h-auto"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1 text-right">{errors.title.message}</p>
          )}
        </div>

        {/* App */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-base text-[#757575] tracking-[-0.176px] flex-shrink-0">
            앱
          </label>
          <Controller
            name="app"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                placeholder="앱을 입력하세요. (선택사항)"
                className="!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none flex-1 ml-4 !p-0 !h-auto"
              />
            )}
          />
          {errors.app && (
            <p className="text-red-500 text-xs mt-1 text-right">{errors.app.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-base text-[#757575] tracking-[-0.176px]">
            날짜
          </label>
          <Controller
            name="selectedDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-base text-[#3d3d3d] text-right tracking-[-0.176px] p-0 h-auto font-normal"
                  >
                    {formatDate(field.value)}
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
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        // 현재 시간을 유지하면서 날짜만 변경
                        const newDate = new Date(field.value || new Date());
                        newDate.setFullYear(date.getFullYear());
                        newDate.setMonth(date.getMonth());
                        newDate.setDate(date.getDate());
                        field.onChange(newDate);
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
            )}
          />
          {errors.selectedDate && (
            <p className="text-red-500 text-xs mt-1 text-right">{errors.selectedDate.message}</p>
          )}
        </div>

        {/* Dutch Pay */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
          <label className="text-[16px] text-[#757575] tracking-[-0.176px] flex-shrink-0">
            더치페이
          </label>
          <div className="flex items-center gap-2">
            <Controller
              name="dutchPayCount"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={field.value || 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numericValue = value.replace(/[^0-9]/g, '');
                    const parsedValue = numericValue === '' ? 1 : Math.max(1, parseInt(numericValue, 10));
                    field.onChange(parsedValue);
                  }}
                  placeholder="1"
                  className="!w-[55px] !h-[44px] !text-center !text-[16px] !text-[#3d3d3d] !font-medium"
                />
              )}
            />
            {dutchPayCount > 1 && price && (
              <div className="text-sm text-[#757575]">
                (1인당: {calculateDutchPayAmount()}원)
              </div>
            )}
          </div>
          {errors.dutchPayCount && (
            <p className="text-red-500 text-xs mt-1 text-right">{errors.dutchPayCount.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}
