import { Controller } from 'react-hook-form';
import { ChevronRight, CalendarIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer';
import { Calendar } from '@/shared/components/ui/calendar';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';
import type { ExpenseHookFormProps } from '@/features/expenses/_lib/types/components';
import { PriceInput } from '@/features/expenses/components/Form/PriceInput';
import { ExpenseTypeSelector } from '@/features/expenses/components/Form/ExpenseTypeSelector';
import { FormField } from '@/features/expenses/components/Form/FormField';
import { formatDateForDisplay, calculateDutchPayAmount } from '@/features/expenses/utils/formUtils';
import { useExpenseForm } from '@/features/expenses/hooks/useExpenseForm';

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
  const {
    form,
    watchedValues,
    calendarHandlers,
    dutchPayHandlers,
  } = useExpenseForm({ defaultValues, onValidationChange });

  const { control, handleSubmit, setValue, formState: { errors } } = form;
  const { dutchPayCount, price } = watchedValues;

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
                <Drawer open={calendarHandlers.isOpen} onOpenChange={calendarHandlers.setIsOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-base text-[#3d3d3d] tracking-[-0.176px] !p-0 h-auto font-normal justify-between hover:bg-transparent"
                    >
                      {formatDateForDisplay(field.value)}
                      <CalendarIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="w-auto overflow-hidden p-0">
                    <DrawerHeader className="sr-only">
                      <DrawerTitle>날짜 선택</DrawerTitle>
                      <DrawerDescription>지출 날짜를 선택하세요</DrawerDescription>
                    </DrawerHeader>
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
                          calendarHandlers.setIsOpen(false);
                        }
                      }}
                      captionLayout="dropdown"
                      className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)] border-none"
                    />
                  </DrawerContent>
                </Drawer>
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
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={dutchPayHandlers.input}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/[^0-9]/g, '');
                    dutchPayHandlers.setInput(numeric);
                    if (numeric !== '') {
                      const next = Math.max(1, parseInt(numeric, 10));
                      field.onChange(next);
                    }
                  }}
                  onBlur={() => {
                    const next = dutchPayHandlers.input === '' ? 1 : Math.max(1, parseInt(dutchPayHandlers.input, 10));
                    dutchPayHandlers.setInput(String(next));
                    field.onChange(next);
                  }}
                  placeholder="1"
                  className="!w-[55px] !h-[44px] !text-center !text-[16px] !text-[#3d3d3d] !font-medium"
                />
              )}
            />
            {dutchPayCount > 1 && price && (
              <div className="text-sm text-sub-gray transition-opacity duration-200">
                (1인당: {calculateDutchPayAmount(price, dutchPayCount)}원)
              </div>
            )}
          </div>
        </FormField>
      </div>
    </form>
  );
}
