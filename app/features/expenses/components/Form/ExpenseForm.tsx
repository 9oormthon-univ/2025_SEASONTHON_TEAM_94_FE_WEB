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
import { ExpenseTypeSelector } from './ExpenseTypeSelector';
import { FormField } from './FormField';
import { InputField } from './InputField';
import { NumberStepper } from './NumberStepper';
import { CategorySelector } from './CategorySelector';
import { DatePickerField } from './DatePickerField';
import { DutchPayField } from './DutchPayField';
import { formatDateForDisplay } from '@/features/expenses/utils/dateUtils';
import { calculateDutchPayAmount } from '@/features/expenses/utils/calculationUtils';
import { useExpenseForm } from '@/features/expenses/hooks/useExpenseForm';

interface ExpenseFormProps {
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

  const handleDutchPayChange = (value: number) => {
    setValue('splitCount', value); // splitCount도 함께 업데이트
    dutchPayHandlers.setInput(String(value));
  };

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
                value={field.value ? `-${field.value.toLocaleString()}` : ''}
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
        <DutchPayField
          control={control}
          errors={errors}
          price={price}
          dutchPayCount={dutchPayCount}
          onDutchPayChange={handleDutchPayChange}
        />

        {/* Date */}
        <DatePickerField
          control={control}
          errors={errors}
          isCalendarOpen={calendarHandlers.isOpen}
          onCalendarOpenChange={calendarHandlers.setIsOpen}
        />

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
