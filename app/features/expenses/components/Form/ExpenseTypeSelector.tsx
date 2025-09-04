import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { cn } from '@/shared/utils/utils';
import { EXPENSE_TYPES } from '@/shared/types/expense';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';

interface ExpenseTypeSelectorProps {
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
}

export function ExpenseTypeSelector({ control, errors }: ExpenseTypeSelectorProps) {
  return (
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
              className="bg-[#FFE4D3] rounded-[10px] h-[50px] w-full p-1 relative border-none shadow-none flex items-center justify-center"
            >
              <div
                className={cn(
                  'absolute top-[2px] left-1 h-[46px] bg-main-orange rounded-[8px] transition-all duration-300 ease-in-out shadow-sm w-[calc(50%-2px)]',
                  field.value === EXPENSE_TYPES.FIXED_EXPENSE
                    ? 'translate-x-full'
                    : 'translate-x-0'
                )}
              />
              
              <TabsTrigger 
                value={EXPENSE_TYPES.OVER_EXPENSE}
                className="h-[46px] rounded-[8px] text-[16px] text-base font-semibold min-h-[46px] min-w-auto relative z-10 bg-transparent transition-colors duration-300 flex-1 flex items-center justify-center self-center data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-black"
              >
                초과지출
              </TabsTrigger>
              <TabsTrigger 
                value={EXPENSE_TYPES.FIXED_EXPENSE}
                className="h-[46px] rounded-[8px] text-[16px] text-base font-semibold min-h-[46px] min-w-auto relative z-10 bg-transparent transition-colors duration-300 flex-1 flex items-center justify-center self-center data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-black"
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
  );
}
