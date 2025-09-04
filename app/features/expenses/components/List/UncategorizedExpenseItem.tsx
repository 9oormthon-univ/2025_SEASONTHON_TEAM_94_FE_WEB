import React from 'react';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import type { Transaction, ExpenseCategory } from '@/shared/types/expense';
import { formatExpenseDate } from '@/features/expenses/utils/expenseUtils';

// 카테고리 매핑 정보 (CategorySelector에서 가져온 정보)
const CATEGORY_MAPPING: Record<
  ExpenseCategory,
  { label: string; icon: string }
> = {
  FOOD: { label: '식사', icon: '/app/assets/category/food.svg' },
  ENTERTAINMENT: { label: '카페', icon: '/app/assets/category/cafe.svg' },
  TRANSPORT: { label: '교통', icon: '/app/assets/category/transit.svg' },
  BEAUTY: { label: '패션/미용', icon: '/app/assets/category/fashion.svg' },
  SHOPPING: {
    label: '편의점',
    icon: '/app/assets/category/convenience_store.svg',
  },
  GROCERIES: { label: '생활용품', icon: '/app/assets/category/essentials.svg' },
  HOUSING: { label: '가구', icon: '/app/assets/category/furniture.svg' },
  SUBSCRIPTIONS: {
    label: '경조사/회비',
    icon: '/app/assets/category/dues.svg',
  },
  HEALTHCARE: { label: '자기계발', icon: '/app/assets/category/growth.svg' },
  EDUCATION: { label: '문화생활', icon: '/app/assets/category/culture.svg' },
  UTILITIES: { label: '주거/통신', icon: '/app/assets/category/utilities.svg' },
  OTHER: { label: '기타', icon: '/app/assets/category/etc.svg' },
  // 추가 카테고리들 (기본 아이콘 사용)
  CAR: { label: '자동차', icon: '/app/assets/category/etc.svg' },
  TELECOM: { label: '통신', icon: '/app/assets/category/utilities.svg' },
  TRAVEL: { label: '여행', icon: '/app/assets/category/etc.svg' },
  PETS: { label: '반려동물', icon: '/app/assets/category/etc.svg' },
  GIFTS_OCCASIONS: {
    label: '선물/경조사',
    icon: '/app/assets/category/dues.svg',
  },
  INSURANCE: { label: '보험', icon: '/app/assets/category/etc.svg' },
  TAXES_FEES: { label: '세금/수수료', icon: '/app/assets/category/etc.svg' },
  DONATION: { label: '기부', icon: '/app/assets/category/etc.svg' },
};

interface UncategorizedExpenseItemProps {
  expense: Transaction;
  isSelected: boolean;
  onCheckboxChange: (expenseId: number, checked: boolean) => void;
}

export function UncategorizedExpenseItem({
  expense,
  isSelected,
  onCheckboxChange,
}: UncategorizedExpenseItemProps) {
  const handleCheckboxChange = (checked: boolean) => {
    onCheckboxChange(expense.id, checked);
  };

  // 데이터에서 카테고리가 설정된 경우에만 표시
  const hasCategory = expense.category && expense.category in CATEGORY_MAPPING;
  const categoryInfo = hasCategory ? CATEGORY_MAPPING[expense.category!] : null;

  return (
    <div className="bg-white h-25 rounded-lg relative px-4 py-3">
      <div className="flex flex-col gap-0.5 h-full">
        {/* Date and Checkbox Row */}
        <div className="flex items-end justify-between h-[18px]">
          <div className="text-sub-gray justify-start text-sub-Color text-xs font-medium">
            {formatExpenseDate(expense.startedAt)}
          </div>
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="w-[18px] h-[18px] border-[#bfbfbf] data-[state=checked]:bg-[#ff6200] data-[state=checked]:border-[#ff6200]"
          />
        </div>

        {/* Merchant Name */}
        <div className="text-black justify-start text-base">
          {expense.title}
        </div>

        {/* Amount and Category Row */}
        <div className="flex items-end justify-between">
          <div className="justify-start text-black text-xl font-bold">
            -{expense.price.toLocaleString()}원
          </div>

          {/* Category Badge - 데이터에 카테고리가 있을 때만 표시 */}
          {hasCategory && categoryInfo && (
            <Badge
              variant="outline"
              className="rounded-[100px] px-3 py-1 flex items-center gap-1.5 border-main-orange text-main-orange"
            >
              <img
                src={categoryInfo.icon}
                alt={categoryInfo.label}
                className="w-3.5 h-3.5"
              />
              <span className="justify-start text-xs font-medium">
                {categoryInfo.label}
              </span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
