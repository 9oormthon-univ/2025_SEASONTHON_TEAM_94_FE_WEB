/**
 * 계산 관련 유틸리티 함수들
 */

/**
 * 통합된 계산 유틸리티 클래스
 */
export class CalculationUtils {
  static readonly DUTCH_PAY_MAX_COUNT = 20;
  static readonly DUTCH_PAY_MIN_COUNT = 1;

  /**
   * 더치페이 금액을 계산합니다
   */
  static calculateDutchPayAmount(price: number, dutchPayCount: number): string {
    if (dutchPayCount <= this.DUTCH_PAY_MIN_COUNT || !price) {
      return price.toLocaleString();
    }
    return Math.floor(price / dutchPayCount).toLocaleString();
  }

  /**
   * 숫자에 천 단위 구분자를 추가합니다
   */
  static formatNumberWithCommas(num: number): string {
    return num.toLocaleString();
  }

  /**
   * 금액을 원화 형식으로 포맷팅합니다
   */
  static formatCurrency(amount: number): string {
    return `${amount.toLocaleString()}원`;
  }

  /**
   * 총 금액을 계산합니다
   */
  static calculateTotalAmount(items: Array<{ price: number }>): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  /**
   * 평균 금액을 계산합니다
   */
  static calculateAverageAmount(items: Array<{ price: number }>): number {
    if (items.length === 0) return 0;
    return this.calculateTotalAmount(items) / items.length;
  }

  /**
   * 더치페이 인원수가 유효한지 확인합니다
   */
  static isValidDutchPayCount(count: number): boolean {
    return count >= this.DUTCH_PAY_MIN_COUNT && count <= this.DUTCH_PAY_MAX_COUNT;
  }

  /**
   * 금액이 유효한지 확인합니다 (0 이상)
   */
  static isValidAmount(amount: number): boolean {
    return amount >= 0 && !isNaN(amount) && isFinite(amount);
  }

  /**
   * 두 금액의 차이를 계산합니다
   */
  static calculateDifference(amount1: number, amount2: number): number {
    return Math.abs(amount1 - amount2);
  }

  /**
   * 백분율을 계산합니다
   */
  static calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  }

  /**
   * 금액을 반올림합니다
   */
  static roundAmount(amount: number, decimals: number = 0): number {
    return Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * 금액을 내림합니다
   */
  static floorAmount(amount: number): number {
    return Math.floor(amount);
  }

  /**
   * 금액을 올림합니다
   */
  static ceilAmount(amount: number): number {
    return Math.ceil(amount);
  }
}

// 기존 함수들과의 호환성을 위한 래퍼 함수들
export const calculateDutchPayAmount = CalculationUtils.calculateDutchPayAmount;
export const formatNumberWithCommas = CalculationUtils.formatNumberWithCommas;
export const formatCurrency = CalculationUtils.formatCurrency;
export const calculateTotalAmount = CalculationUtils.calculateTotalAmount;
