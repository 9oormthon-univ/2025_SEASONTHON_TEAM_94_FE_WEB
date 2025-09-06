import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from '@/shared/types/expense';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';

// 카테고리 데이터 정의 (기존 EXPENSE_CATEGORIES와 매핑)
const CATEGORIES: ReadonlyArray<{
  readonly id: ExpenseCategory;
  readonly label: string;
  readonly icon: string;
}> = [
  {
    id: EXPENSE_CATEGORIES.FOOD,
    label: '식사',
    icon: '/app/assets/food.svg',
  },
  {
    id: EXPENSE_CATEGORIES.ENTERTAINMENT,
    label: '카페',
    icon: '/app/assets/cafe.svg',
  },
  {
    id: EXPENSE_CATEGORIES.TRANSPORT,
    label: '교통',
    icon: '/app/assets/transit.svg',
  },
  {
    id: EXPENSE_CATEGORIES.BEAUTY,
    label: '패션/미용',
    icon: '/app/assets/fashion.svg',
  },
  {
    id: EXPENSE_CATEGORIES.SHOPPING,
    label: '편의점',
    icon: '/app/assets/convenience_store.svg',
  },
  {
    id: EXPENSE_CATEGORIES.GROCERIES,
    label: '생활용품',
    icon: '/app/assets/essentials.svg',
  },
  {
    id: EXPENSE_CATEGORIES.HOUSING,
    label: '가구',
    icon: '/app/assets/furniture.svg',
  },
  {
    id: EXPENSE_CATEGORIES.SUBSCRIPTIONS,
    label: '경조사/회비',
    icon: '/app/assets/dues.svg',
  },
  {
    id: EXPENSE_CATEGORIES.HEALTHCARE,
    label: '자기계발',
    icon: '/app/assets/growth.svg',
  },
  {
    id: EXPENSE_CATEGORIES.EDUCATION,
    label: '문화생활',
    icon: '/app/assets/culture.svg',
  },
  {
    id: EXPENSE_CATEGORIES.UTILITIES,
    label: '주거/통신',
    icon: '/app/assets/utilities.svg',
  },
  {
    id: EXPENSE_CATEGORIES.OTHER,
    label: '기타',
    icon: '/app/assets/etc.svg',
  },
] as const;

interface CategorySelectorProps {
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
}

export function CategorySelector({ control, errors }: CategorySelectorProps) {
  return (
    <div className="px-4 sm:px-6">
      <div className="py-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base text-gray-700 font-medium">카테고리</span>
          {errors.category && (
            <span className="text-red-500 text-sm">
              {errors.category.message}
            </span>
          )}
        </div>

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(category => {
                const isSelected = field.value === category.id;

                return (
                  <motion.div
                    key={category.id}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Button
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      className={`
                        w-full h-auto p-3 flex flex-col items-center gap-2 border rounded-lg transition-all
                        ${
                          isSelected
                            ? 'bg-main-orange border-main-orange text-white hover:bg-main-orange/90'
                            : 'bg-white border-sub-gray text-sub-gray hover:bg-gray-50'
                        }
                      `}
                      onClick={() => {
                        // 이미 선택된 카테고리를 다시 클릭하면 선택 해제
                        field.onChange(isSelected ? undefined : category.id);
                      }}
                    >
                      <img
                        src={category.icon}
                        alt={category.label}
                        className={`w-6 h-6 ${
                          isSelected
                            ? 'filter brightness-0 invert'
                            : 'filter brightness-0 invert-0'
                        }`}
                        style={
                          isSelected
                            ? {}
                            : {
                                filter:
                                  'brightness(0) saturate(100%) invert(74%) sepia(8%) saturate(0%) hue-rotate(171deg) brightness(95%) contrast(88%)',
                              }
                        }
                      />
                      <span className="text-xs font-medium">
                        {category.label}
                      </span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        />
      </div>
    </div>
  );
}
