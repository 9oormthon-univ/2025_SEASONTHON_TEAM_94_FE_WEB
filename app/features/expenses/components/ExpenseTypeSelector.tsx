import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { cn } from '@/shared/utils/utils';
import { EXPENSE_TYPES } from '@/shared/types/expense';
import type { ExpenseFormData } from '@/features/expenses/utils/validation';

interface ExpenseTypeSelectorProps {
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
}

const tabsListStyles = {
  backgroundColor: '#e6e6e6',
  borderRadius: '10px',
  height: '45px',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const tabsTriggerStyles = {
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
};

const commonTriggerClassName = "!h-[37px] !rounded-[8px] !text-[16px] !font-bold !min-h-[37px] !min-w-auto !relative !z-10 !bg-transparent !transition-colors !duration-300 !flex-1 !flex !items-center !justify-center !self-center data-[state=active]:!bg-transparent data-[state=active]:!text-white data-[state=inactive]:!text-gray-600";

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
              className="!bg-[#e6e6e6] !rounded-[10px] !h-[45px] !w-full !p-1 !relative !border-none !shadow-none !flex !items-center !justify-center"
              style={tabsListStyles}
            >
              <div
                className={cn(
                  'absolute top-1 left-1 h-[37px] bg-[#ff6200] rounded-[8px] transition-all duration-300 ease-in-out shadow-sm',
                  field.value === EXPENSE_TYPES.FIXED_EXPENSE
                    ? 'translate-x-full'
                    : 'translate-x-0'
                )}
                style={{
                  width: 'calc(50% - 2px)',
                }}
              />
              
              <TabsTrigger 
                value={EXPENSE_TYPES.OVER_EXPENSE}
                className={commonTriggerClassName}
                style={tabsTriggerStyles}
              >
                초과지출
              </TabsTrigger>
              <TabsTrigger 
                value={EXPENSE_TYPES.FIXED_EXPENSE}
                className={commonTriggerClassName}
                style={tabsTriggerStyles}
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
