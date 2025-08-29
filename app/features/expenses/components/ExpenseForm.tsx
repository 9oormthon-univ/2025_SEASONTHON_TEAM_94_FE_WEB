import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
} from 'lucide-react';
import Edit from '@/assets/edit.svg?react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { cn } from '@/shared/utils/utils';
import { EXPENSE_TYPES } from '@/shared/types/expense';
import { expenseFormSchema, type ExpenseFormData } from '@/features/expenses/utils/validation';
import type { ExpenseHookFormProps } from '@/features/expenses/_lib/types/components';

interface ExpenseFormProps extends ExpenseHookFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  defaultValues?: Partial<ExpenseFormData>;
  onValidationChange?: (isValid: boolean) => void;
}

export function ExpenseForm({
  onSubmit,
  defaultValues,
  onValidationChange,
}: ExpenseFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // 기본 날짜 값을 메모이제이션하여 리렌더링 시에도 동일한 시간 유지
  const defaultSelectedDate = useMemo(() => {
    return defaultValues?.selectedDate || new Date();
  }, [defaultValues?.selectedDate]);
  
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
      app: '',
      category: undefined,
      // type이 항상 정의되도록 보장
      type: EXPENSE_TYPES.OVER_EXPENSE,
      // dutchPayCount가 항상 정의되도록 보장
      dutchPayCount: 1,
      ...defaultValues,
      // 수정 시 기존 시간 유지, 생성 시에만 현재 시간 사용
      selectedDate: defaultSelectedDate,
    },
  });

  const watchedValues = watch();
  const { selectedDate, dutchPayCount, price, type, title } = watchedValues;

  // 필수 필드 검증
  const isFormValid = price > 0 && title.trim().length > 0;

  // 유효성 상태 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

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

  const handleFormSubmit = (data: ExpenseFormData) => {
    onSubmit(data);
  };

  return (
    <form id="expense-form" onSubmit={handleSubmit(onSubmit as any)}>
      {/* Expense Type Selector */}
      <div className="px-4 sm:px-6 pb-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Tabs 
              value={field.value} 
              onValueChange={field.onChange}
              className="w-full"
            >
              <TabsList 
                className="!bg-[#e6e6e6] !rounded-[10px] !h-[45px] !w-full !p-1 !relative !border-none !shadow-none !flex !items-center !justify-center"
                style={{ 
                  backgroundColor: '#e6e6e6',
                  borderRadius: '10px',
                  height: '45px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* 슬라이딩 배경 */}
                <div
                  className={cn(
                    'absolute top-1 left-1 h-[37px] bg-[#ff6200] rounded-[8px] transition-all duration-300 ease-in-out shadow-sm',
                    field.value === EXPENSE_TYPES.FIXED_EXPENSE
                      ? 'translate-x-full'
                      : 'translate-x-0'
                  )}
                  style={{
                    width: 'calc(50% - 2px)', // 패딩 고려해서 조금 작게
                  }}
                />
                
                <TabsTrigger 
                  value={EXPENSE_TYPES.OVER_EXPENSE}
                  className="!h-[37px] !rounded-[8px] !text-[16px] !font-bold !min-h-[37px] !min-w-auto !relative !z-10 !bg-transparent !transition-colors !duration-300 !flex-1 !flex !items-center !justify-center !self-center data-[state=active]:!bg-transparent data-[state=active]:!text-white data-[state=inactive]:!text-gray-600"
                  style={{
                    height: '37px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    minHeight: '37px',
                    minWidth: 'auto',
                    backgroundColor: 'transparent',
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center'
                  }}
                >
                  초과지출
                </TabsTrigger>
                <TabsTrigger 
                  value={EXPENSE_TYPES.FIXED_EXPENSE}
                  className="!h-[37px] !rounded-[8px] !text-[16px] !font-bold !min-h-[37px] !min-w-auto !relative !z-10 !bg-transparent !transition-colors !duration-300 !flex-1 !flex !items-center !justify-center !self-center data-[state=active]:!bg-transparent data-[state=active]:!text-white data-[state=inactive]:!text-gray-600"
                  style={{
                    height: '37px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    minHeight: '37px',
                    minWidth: 'auto',
                    backgroundColor: 'transparent',
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center'
                  }}
                >
                  고정지출
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
          <Edit className="w-4 h-4 text-gray-400" />
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
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-base text-[#3d3d3d] text-right tracking-[-0.176px] p-0 h-auto font-normal"
                  >
                    {formatDate(field.value)}
                    <ChevronRight className="w-3 h-3 ml-2" />
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
                        // 캘린더에서 선택된 날짜는 로컬 타임존의 00:00:00
                        // 기존 시간을 보존하면서 날짜만 변경
                        const currentDate = field.value;
                        
                        // 새로운 날짜 객체 생성 (로컬 타임존 유지)
                        const newDate = new Date(
                          date.getFullYear(),
                          date.getMonth(), 
                          date.getDate(),
                          currentDate.getHours(),
                          currentDate.getMinutes(),
                          currentDate.getSeconds(),
                          currentDate.getMilliseconds()
                        );
                        
                        field.onChange(newDate);
                        // 날짜 선택 후 캘린더 닫기
                        setIsCalendarOpen(false);
                      }
                    }}
                    captionLayout="dropdown"
                    className="rounded-md border shadow-lg text-sm"
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
