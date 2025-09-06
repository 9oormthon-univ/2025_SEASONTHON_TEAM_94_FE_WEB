import type { ExpenseCategory } from '@/shared/types/expense';

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

/**
 * 카테고리 관련 유틸리티 함수들
 */

// 카테고리 매핑 정보
export const CATEGORY_MAPPING: Record<
  ExpenseCategory,
  { label: string; icon: string }
> = {
  FOOD: { label: '식사', icon: FoodIcon },
  ENTERTAINMENT: { label: '카페', icon: CafeIcon },
  TRANSPORT: { label: '교통', icon: TransitIcon },
  BEAUTY: { label: '패션/미용', icon: FashionIcon },
  SHOPPING: {
    label: '편의점',
    icon: ConvenienceStoreIcon,
  },
  GROCERIES: { label: '생활용품', icon: EssentialsIcon },
  HOUSING: { label: '가구', icon: FurnitureIcon },
  SUBSCRIPTIONS: {
    label: '경조사/회비',
    icon: DuesIcon,
  },
  HEALTHCARE: { label: '자기계발', icon: GrowthIcon },
  EDUCATION: { label: '문화생활', icon: CultureIcon },
  UTILITIES: { label: '주거/통신', icon: UtilitiesIcon },
  OTHER: { label: '기타', icon: EtcIcon },
  // 추가 카테고리들 (기본 아이콘 사용)
  CAR: { label: '자동차', icon: EtcIcon },
  TELECOM: { label: '통신', icon: UtilitiesIcon },
  TRAVEL: { label: '여행', icon: EtcIcon },
  PETS: { label: '반려동물', icon: EtcIcon },
  GIFTS_OCCASIONS: {
    label: '선물/경조사',
    icon: DuesIcon,
  },
  INSURANCE: { label: '보험', icon: EtcIcon },
  TAXES_FEES: { label: '세금/수수료', icon: EtcIcon },
  DONATION: { label: '기부', icon: EtcIcon },
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
