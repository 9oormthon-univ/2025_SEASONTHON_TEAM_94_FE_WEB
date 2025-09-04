import { Controller } from 'react-hook-form';
import { CalendarIcon, Clock } from 'lucide-react';
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
import { ExpenseTypeSelector } from './ExpenseTypeSelector';
import { FormField } from './FormField';
import { InputField } from './InputField';
import { NumberStepper } from './NumberStepper';
import { CategorySelector } from './CategorySelector';
import {
  formatDateForDisplay,
  calculateDutchPayAmount,
} from '@/features/expenses/utils/formUtils';
import { useExpenseForm } from '@/features/expenses/hooks/useExpenseForm';

// 날짜 선택 핸들러 분리
const createDateSelectHandler = (
  currentDate: Date,
  onChange: (date: Date) => void,
  onClose: () => void
) => {
  return (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds()
      );
      onChange(newDate);
      onClose();
    }
  };
};

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
  const { form, watchedValues, calendarHandlers, dutchPayHandlers } =
    useExpenseForm({ defaultValues, onValidationChange });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;
  const { dutchPayCount, price } = watchedValues;

  return (
    <form id="expense-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Expense Type Selector */}
      <ExpenseTypeSelector control={control} errors={errors} />

      {/* Price Input */}
      <div className="px-4 sm:px-6 py-4">
        <InputField label="금액" error={errors.price?.message} htmlFor="price">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="금액을 입력하세요."
                value={field.value ? field.value.toLocaleString() : ''}
                onChange={e => {
                  const numericValue = e.target.value.replace(/[^\d]/g, '');
                  field.onChange(numericValue ? parseInt(numericValue, 10) : 0);
                }}
                className="text-base h-[56px]"
              />
            )}
          />
        </InputField>
      </div>

      {/* Form Fields */}
      <div className="px-4 sm:px-6 space-y-6">
        {/* Merchant */}
        <InputField
          label="거래처"
          error={errors.title?.message}
          htmlFor="title"
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                id="title"
                type="text"
                {...field}
                placeholder="거래처를 입력하세요."
                className="text-base h-[56px]"
              />
            )}
          />
        </InputField>

        {/* Dutch Pay */}
        <FormField label="더치페이" error={errors.dutchPayCount?.message}>
          <div className="flex items-center gap-2 justify-end">
            <Controller
              name="dutchPayCount"
              control={control}
              render={({ field }) => (
                <NumberStepper
                  value={field.value}
                  onChange={value => {
                    field.onChange(value);
                    setValue('splitCount', value); // splitCount도 함께 업데이트
                    dutchPayHandlers.setInput(String(value));
                  }}
                  min={1}
                  max={20}
                  price={price}
                />
              )}
            />
            {dutchPayCount > 1 && price && (
              <div className="text-sm text-[#BFBFBF] transition-opacity duration-200">
                (1인당: {calculateDutchPayAmount(price, dutchPayCount)}원)
              </div>
            )}
          </div>
        </FormField>

        {/* Date */}
        <InputField label="지출일시" error={errors.selectedDate?.message}>
          <Controller
            name="selectedDate"
            control={control}
            render={({ field }) => (
              <Drawer
                open={calendarHandlers.isOpen}
                onOpenChange={calendarHandlers.setIsOpen}
              >
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-base text-[#3d3d3d] font-normal h-[60px] border-sub-gray"
                  >
                    {formatDateForDisplay(field.value)}
                    <CalendarIcon className="w-4 h-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="w-auto overflow-hidden p-0">
                  <DrawerHeader className="sr-only">
                    <DrawerTitle>날짜 선택</DrawerTitle>
                    <DrawerDescription>
                      지출 날짜를 선택하세요
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-col">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={createDateSelectHandler(
                        field.value,
                        field.onChange,
                        () => calendarHandlers.setIsOpen(false)
                      )}
                      captionLayout="dropdown"
                      className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)] border-none"
                    />
                    {/* Time Picker */}
                    <div className="px-4 py-4 border-t border-gray-200 mb-4">
                      <div className="relative">
                        <Input
                          type="time"
                          value={`${String(field.value.getHours()).padStart(
                            2,
                            '0'
                          )}:${String(field.value.getMinutes()).padStart(
                            2,
                            '0'
                          )}`}
                          onChange={e => {
                            const [hours, minutes] = e.target.value
                              .split(':')
                              .map(Number);
                            const newDate = new Date(field.value);
                            newDate.setHours(hours || 0);
                            newDate.setMinutes(minutes || 0);
                            field.onChange(newDate);
                          }}
                          className="w-full h-[50px] text-base text-[#3d3d3d] font-normal text-center pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          />
        </InputField>

        {/* Memo */}
        <InputField label="메모" error={errors.memo?.message} htmlFor="memo">
          <Controller
            name="memo"
            control={control}
            render={({ field }) => (
              <Input
                id="memo"
                type="text"
                {...field}
                placeholder="메모를 입력하세요. (선택사항)"
                className="text-base h-[56px]"
              />
            )}
          />
        </InputField>
      </div>

      {/* Category Selector */}
      <CategorySelector control={control} errors={errors} />
    </form>
  );
}
