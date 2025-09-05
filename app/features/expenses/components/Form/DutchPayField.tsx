import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { FormField } from './FormField';
import { NumberStepper } from './NumberStepper';
import { calculateDutchPayAmount } from '@/features/expenses/utils/calculationUtils';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';

interface DutchPayFieldProps {
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
  price: number;
  dutchPayCount: number;
  onDutchPayChange: (value: number) => void;
}

export function DutchPayField({ 
  control, 
  errors, 
  price, 
  dutchPayCount, 
  onDutchPayChange 
}: DutchPayFieldProps) {
  return (
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
                onDutchPayChange(value);
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
  );
}
