import { cn } from '@/shared/utils/utils';
import { EXPENSE_TYPES, type ExpenseType } from '@/shared/types/expense';

interface ExpenseTypeSelectorProps {
  expenseType: ExpenseType;
  onTypeChange: (type: ExpenseType) => void;
}

export function ExpenseTypeSelector({
  expenseType,
  onTypeChange,
}: ExpenseTypeSelectorProps) {
  return (
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
          onClick={() => onTypeChange(EXPENSE_TYPES.OVER_EXPENSE)}
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
          onClick={() => onTypeChange(EXPENSE_TYPES.FIXED_EXPENSE)}
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
  );
}
