import type { ExpenseFormData } from '@/features/expenses/_lib/validation';
import type { TransactionCreateRequest } from '@/shared/types/expense';

/**
 * 폼 데이터를 API 요청 데이터로 변환합니다
 */
export function convertFormDataToApiRequest(
  formData: ExpenseFormData
): TransactionCreateRequest {
  return {
    price: formData.price,
    title: formData.title,
    bankName: formData.bankName,
    splitCount: formData.dutchPayCount, // dutchPayCount를 splitCount로 매핑
    type: formData.type,
    category: formData.category,
    startAt: formData.selectedDate.toISOString(),
    // memo는 TransactionCreateRequest에 없으므로 제외
  };
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
 * 지출 목록에서 사용하는 상세한 날짜 포맷팅 함수
 * 형식: "월일 요일 시:분:초"
 */
export function formatExpenseDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ][date.getDay()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}월 ${day}일 ${dayOfWeek} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
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
