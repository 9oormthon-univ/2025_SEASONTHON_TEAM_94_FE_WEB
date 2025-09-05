import type { ExpenseCategory } from '@/shared/types/expense';

/**
 * 카테고리 관련 유틸리티 함수들
 */

// 카테고리 매핑 정보
export const CATEGORY_MAPPING: Record<
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

/**
 * 카테고리 정보를 가져옵니다
 */
export function getCategoryInfo(category: ExpenseCategory | undefined) {
  if (!category || !(category in CATEGORY_MAPPING)) {
    return null;
  }
  return CATEGORY_MAPPING[category];
}

/**
 * 카테고리가 유효한지 확인합니다
 */
export function isValidCategory(
  category: ExpenseCategory | undefined
): boolean {
  return category !== undefined && category in CATEGORY_MAPPING;
}
