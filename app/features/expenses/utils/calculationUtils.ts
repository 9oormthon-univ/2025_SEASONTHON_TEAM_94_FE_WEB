/**
 * 계산 관련 유틸리티 함수들
 */

/**
 * 더치페이 금액을 계산합니다
 */
export function calculateDutchPayAmount(
  price: number,
  dutchPayCount: number
): string {
  if (dutchPayCount <= 1 || !price) return price.toLocaleString();
  return Math.floor(price / dutchPayCount).toLocaleString();
}

/**
 * 숫자에 천 단위 구분자를 추가합니다
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}

/**
 * 금액을 원화 형식으로 포맷팅합니다
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()}원`;
}

/**
 * 총 금액을 계산합니다
 */
export function calculateTotalAmount(items: Array<{ price: number }>): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
