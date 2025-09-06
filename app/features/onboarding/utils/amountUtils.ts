/**
 * 금액 관련 유틸리티 함수들
 */

/**
 * 숫자 문자열을 포맷팅된 금액 문자열로 변환
 * @param amount - 숫자 문자열
 * @returns 포맷팅된 금액 문자열 (예: "1,000원")
 */
export function formatAmount(amount: string): string {
  if (!amount) return '';
  return `${parseInt(amount).toLocaleString()}원`;
}


/**
 * 입력 필드에서 숫자 키 입력을 처리하는 핸들러
 * @param e - 키보드 이벤트
 * @param currentAmount - 현재 금액 문자열
 * @param setAmount - 금액 설정 함수
 * @param setIsValid - 유효성 설정 함수
 */
export function handleNumericKeyInput(
  e: React.KeyboardEvent<HTMLInputElement>,
  currentAmount: string,
  setAmount: (amount: string) => void,
  setIsValid: (isValid: boolean) => void
): void {
  const input = e.target as HTMLInputElement;
  const cursorPosition = input.selectionStart || 0;
  const value = input.value;

  // 숫자 입력 처리
  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
    const newNumericValue = currentAmount + e.key;
    setAmount(newNumericValue);
    setIsValid(newNumericValue.length > 0);

    // 포커스를 "원" 앞으로 유지
    setTimeout(() => {
      const newFormattedValue = formatAmount(newNumericValue);
      const newCursorPosition = newFormattedValue.length - 1; // "원" 바로 앞
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }
}

/**
 * 입력 필드에서 Backspace 키 입력을 처리하는 핸들러
 * @param e - 키보드 이벤트
 * @param currentAmount - 현재 금액 문자열
 * @param setAmount - 금액 설정 함수
 * @param setIsValid - 유효성 설정 함수
 */
export function handleBackspaceKeyInput(
  e: React.KeyboardEvent<HTMLInputElement>,
  currentAmount: string,
  setAmount: (amount: string) => void,
  setIsValid: (isValid: boolean) => void
): void {
  const input = e.target as HTMLInputElement;
  const cursorPosition = input.selectionStart || 0;
  const value = input.value;

  // "원" 바로 앞에서 Backspace를 누르면 마지막 숫자를 삭제
  if (
    e.key === 'Backspace' &&
    cursorPosition === value.length - 1 &&
    value.endsWith('원')
  ) {
    e.preventDefault();
    const newNumericValue = currentAmount.slice(0, -1);
    setAmount(newNumericValue);
    setIsValid(newNumericValue.length > 0);

    // 포커스를 "원" 앞으로 유지
    setTimeout(() => {
      const newFormattedValue = formatAmount(newNumericValue);
      const newCursorPosition = newFormattedValue.length - 1; // "원" 바로 앞
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }
}

/**
 * 입력 필드에서 포커스 위치를 제한하는 핸들러
 * @param e - 키보드 이벤트
 */
export function handleFocusRestriction(
  e: React.KeyboardEvent<HTMLInputElement>
): void {
  const input = e.target as HTMLInputElement;
  const cursorPosition = input.selectionStart || 0;
  const value = input.value;

  // "원" 뒤로 포커싱이 가지 않도록 방지
  if (cursorPosition >= value.length - 1 && value.endsWith('원')) {
    e.preventDefault();
    input.setSelectionRange(value.length - 1, value.length - 1);
  }
}
