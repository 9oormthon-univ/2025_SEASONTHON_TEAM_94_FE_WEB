import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from '@/shared/types/expense';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';

// 아이콘 imports
import FoodIcon from '@/assets/category/food.svg';
import CafeIcon from '@/assets/category/cafe.svg';
import TransitIcon from '@/assets/category/transit.svg';
import FashionIcon from '@/assets/category/fashion.svg';
import ConvenienceStoreIcon from '@/assets/category/convenience_store.svg';
import EssentialsIcon from '@/assets/category/essentials.svg';
import FurnitureIcon from '@/assets/category/furniture.svg';
import DuesIcon from '@/assets/category/dues.svg';
import GrowthIcon from '@/assets/category/growth.svg';
import CultureIcon from '@/assets/category/culture.svg';
import UtilitiesIcon from '@/assets/category/utilities.svg';
import EtcIcon from '@/assets/category/etc.svg';

// 카테고리 데이터 정의 (기존 EXPENSE_CATEGORIES와 매핑)
const CATEGORIES: ReadonlyArray<{
  readonly id: ExpenseCategory;
  readonly label: string;
  readonly icon: string;
}> = [
  {
    id: EXPENSE_CATEGORIES.FOOD,
    label: '식사',
    icon: FoodIcon,
  },
  {
    id: EXPENSE_CATEGORIES.ENTERTAINMENT,
    label: '카페',
    icon: CafeIcon,
  },
  {
    id: EXPENSE_CATEGORIES.TRANSPORT,
    label: '교통',
    icon: TransitIcon,
  },
  {
    id: EXPENSE_CATEGORIES.BEAUTY,
    label: '패션/미용',
    icon: FashionIcon,
  },
  {
    id: EXPENSE_CATEGORIES.SHOPPING,
    label: '편의점',
    icon: ConvenienceStoreIcon,
  },
  {
    id: EXPENSE_CATEGORIES.GROCERIES,
    label: '생활용품',
    icon: EssentialsIcon,
  },
  {
    id: EXPENSE_CATEGORIES.HOUSING,
    label: '가구',
    icon: FurnitureIcon,
  },
  {
    id: EXPENSE_CATEGORIES.SUBSCRIPTIONS,
    label: '경조사/회비',
    icon: DuesIcon,
  },
  {
    id: EXPENSE_CATEGORIES.HEALTHCARE,
    label: '자기계발',
    icon: GrowthIcon,
  },
  {
    id: EXPENSE_CATEGORIES.EDUCATION,
    label: '문화생활',
    icon: CultureIcon,
  },
  {
    id: EXPENSE_CATEGORIES.UTILITIES,
    label: '주거/통신',
    icon: UtilitiesIcon,
  },
  {
    id: EXPENSE_CATEGORIES.OTHER,
    label: '기타',
    icon: EtcIcon,
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
