import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { EXPENSE_TYPES } from '@/shared/types/expense';
import { expenseFormSchema, type ExpenseFormData } from '@/features/expenses/utils/validation';
import type { ExpenseHookFormProps } from '@/features/expenses/_lib/types/components';
import { PriceInput } from './PriceInput';
import { ExpenseTypeSelector } from './ExpenseTypeSelector';
import { FormField } from './FormField';
import { formatDateForDisplay, calculateDutchPayAmount } from '@/features/expenses/utils/formUtils';

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
  
  const defaultSelectedDate = useMemo(() => {
    return defaultValues?.selectedDate || new Date();
  }, [defaultValues?.selectedDate]);
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      price: 0,
      title: '',
      userUid: '',
      app: '',
      category: undefined,
      type: EXPENSE_TYPES.OVER_EXPENSE,
      dutchPayCount: 1,
      ...defaultValues,
      selectedDate: defaultSelectedDate,
    },
  });

  const watchedValues = watch();
  const { selectedDate, dutchPayCount, price, title } = watchedValues;

  // 모바일에서 더치페이 입력 시 "1"이 지워지지 않는 문제를 해결하기 위해
  // 표시용 로컬 상태를 사용하고, blur 시 유효한 값으로 확정합니다.
  const [dutchInput, setDutchInput] = useState<string>(() => String(dutchPayCount ?? 1));

  // RHF 값이 외부적으로 변경되었을 때 로컬 표시값을 동기화합니다.
  useEffect(() => {
    const next = String(dutchPayCount ?? 1);
    if (next !== dutchInput) setDutchInput(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dutchPayCount]);

  const isFormValid = price > 0 && title.trim().length > 0;

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  return (
    <form id="expense-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Expense Type Selector */}
      <ExpenseTypeSelector control={control} errors={errors} />

      {/* Price Input */}
      <PriceInput control={control} errors={errors} setValue={setValue} />

      {/* Form Fields */}
      <div className="px-4 sm:px-6 space-y-6">
        {/* Merchant */}
        <FormField 
          label="거래처" 
          error={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                placeholder="거래처를 입력하세요."
                onFocus={(e) => {
                  // 모바일에서 포커스 시 커서가 끝으로 이동하는 현상을 방지하고
                  // 사용자가 탭한 위치의 커서를 유지하도록 한 번 더 설정합니다.
                  const el = e.target as HTMLInputElement;
                  const pos = el.selectionStart ?? el.value.length;
                  requestAnimationFrame(() => {
                    try { el.setSelectionRange(pos, pos); } catch {}
                  });
                }}
                className="!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none !p-0 !h-auto"
              />
            )}
          />
        </FormField>

        {/* App */}
        <FormField 
          label="앱" 
          error={errors.app?.message}
        >
          <Controller
            name="app"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                placeholder="앱을 입력하세요. (선택사항)"
                onFocus={(e) => {
                  const el = e.target as HTMLInputElement;
                  const pos = el.selectionStart ?? el.value.length;
                  requestAnimationFrame(() => {
                    try { el.setSelectionRange(pos, pos); } catch {}
                  });
                }}
                className="!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none !p-0 !h-auto"
              />
            )}
          />
        </FormField>

        {/* Date */}
        <FormField 
          label="날짜" 
          error={errors.selectedDate?.message}
        >
          <div className="flex justify-end">
            <Controller
              name="selectedDate"
              control={control}
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-base text-[#3d3d3d] tracking-[-0.176px] !p-0 h-auto font-normal"
                    >
                      {formatDateForDisplay(field.value)}
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0 m-2 max-w-[260px] sm:max-w-[300px]"
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
                        const currentDate = field.value;
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
          </div>
        </FormField>

        {/* Dutch Pay */}
        <FormField 
          label="더치페이" 
          error={errors.dutchPayCount?.message}
        >
          <div className="flex items-center gap-2 justify-end">
            <Controller
              name="dutchPayCount"
              control={control}
              render={({ field }) => (
                <Input
                  // 모바일 숫자 키패드 노출 및 커서 위치 선택 용이성 개선
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={dutchInput}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/[^0-9]/g, '');
                    setDutchInput(numeric);
                    if (numeric !== '') {
                      const next = Math.max(1, parseInt(numeric, 10));
                      field.onChange(next);
                    }
                  }}
                  onBlur={() => {
                    const next = dutchInput === '' ? 1 : Math.max(1, parseInt(dutchInput, 10));
                    setDutchInput(String(next));
                    field.onChange(next);
                  }}
                  placeholder="1"
                  className="!w-[55px] !h-[44px] !text-center !text-[16px] !text-[#3d3d3d] !font-medium"
                />
              )}
            />
            {dutchPayCount > 1 && price && (
              <div className="text-sm text-[#757575]">
                (1인당: {calculateDutchPayAmount(price, dutchPayCount)}원)
              </div>
            )}
          </div>
        </FormField>
      </div>
    </form>
  );
}
