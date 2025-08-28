import {
  EXPENSE_CATEGORIES,
  EXPENSE_TYPES,
  type ExpenseCategory,
  type ExpenseType,
} from '@/shared/types/expense';

/**
 * 텍스트를 기반으로 지출 카테고리를 자동 분류합니다
 */
export function classifyCategory(text: string): ExpenseCategory {
  const t = (text || '').toLowerCase();

  // 구독 서비스
  if (/netflix|유튜브|youtube|디즈니|spotify|애플뮤직|구독/.test(t)) {
    return EXPENSE_CATEGORIES.SUBSCRIPTIONS;
  }

  // 통신비
  if (/통신비|요금제|핸드폰|인터넷|와이파이/.test(t)) {
    return EXPENSE_CATEGORIES.TELECOM;
  }

  // 주거비
  if (/월세|관리비|전기|가스|수도|임대료/.test(t)) {
    return EXPENSE_CATEGORIES.HOUSING;
  }

  // 공과금
  if (/전기요금|가스요금|수도요금/.test(t)) {
    return EXPENSE_CATEGORIES.UTILITIES;
  }

  // 음식
  if (
    /커피|카페|식당|레스토랑|스타벅스|버거|치킨|피자|맥도날드|롯데리아|bhc|배달|음식/.test(
      t
    )
  ) {
    return EXPENSE_CATEGORIES.FOOD;
  }

  // 편의점/쇼핑
  if (/편의점|gs25|cu|세븐일레븐|마트|쇼핑/.test(t)) {
    return EXPENSE_CATEGORIES.SHOPPING;
  }

  // 교통
  if (/지하철|버스|택시|카카오택시|우버|교통/.test(t)) {
    return EXPENSE_CATEGORIES.TRANSPORT;
  }

  return EXPENSE_CATEGORIES.OTHER;
}

/**
 * 텍스트를 기반으로 지출 타입을 자동 분류합니다
 */
export function classifyExpenseType(text: string): ExpenseType {
  const t = (text || '').toLowerCase();

  // 고정 지출 패턴
  if (
    /netflix|유튜브|spotify|구독|월세|관리비|전기|가스|수도|임대료|통신비|요금제|보험/.test(
      t
    )
  ) {
    return EXPENSE_TYPES.FIXED_EXPENSE;
  }

  // 초과 지출 패턴 (사치품, 외식 등)
  if (/스타벅스|카페|치킨|피자|버거|배달|영화|쇼핑|옷|화장품|게임/.test(t)) {
    return EXPENSE_TYPES.OVER_EXPENSE;
  }

  return EXPENSE_TYPES.NONE;
}

/**
 * 날짜를 한국어 형식으로 포맷팅합니다
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * 날짜와 시간을 한국어 형식으로 포맷팅합니다
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
    }) +
    ' ' +
    date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다
 */
export function getTodayYMD(): string {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
