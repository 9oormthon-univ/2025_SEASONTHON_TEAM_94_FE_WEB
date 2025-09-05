/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 통합된 날짜 포맷터 클래스
 */
export class DateFormatter {
  private static readonly LOCALE = 'ko-KR';
  private static readonly WEEKDAYS = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];

  /**
   * 날짜를 한국어 형식으로 포맷팅합니다
   */
  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(this.LOCALE, {
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  /**
   * 날짜와 시간을 한국어 형식으로 포맷팅합니다
   */
  static formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString(this.LOCALE, {
          month: 'numeric',
          day: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString(this.LOCALE, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    } catch {
      return dateString;
    }
  }

  /**
   * 지출 목록에서 사용하는 상세한 날짜 포맷팅 함수
   * 형식: "월일 요일 시:분" (기존과 동일한 형식 유지)
   */
  static formatExpenseDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = DateFormatter.WEEKDAYS[date.getDay()];
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}월 ${day}일 ${dayOfWeek} ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  }

  /**
   * 날짜 헤더용 포맷팅 함수
   * 형식: "8월 27일 수요일" (기존과 동일한 형식 유지)
   */
  static formatDateHeader(dateStr: string): string {
    try {
      // YYYY-MM-DD 형식의 문자열을 더 안전하게 파싱
      let date: Date;

      if (dateStr.includes('T')) {
        // ISO 형식인 경우
        date = new Date(dateStr);
      } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // YYYY-MM-DD 형식인 경우, 시간대 문제를 피하기 위해 명시적으로 파싱
        const [year, month, day] = dateStr.split('-').map(Number);
        date = new Date(year, month - 1, day); // month는 0-based
      } else {
        // 기타 형식
        date = new Date(dateStr);
      }

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return dateStr;
      }

      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = DateFormatter.WEEKDAYS[date.getDay()];

      return `${month}월 ${day}일 ${dayOfWeek}`;
    } catch (error) {
      return dateStr;
    }
  }

  /**
   * Date 객체를 화면 표시용 포맷으로 변환합니다
   * 형식: "24년 12월 27일 14:30" (기존과 동일한 형식 유지)
   */
  static formatDateForDisplay(date: Date): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  }

  /**
   * 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다
   */
  static getTodayYMD(): string {
    const d = new Date();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  /**
   * 날짜 문자열이 유효한지 확인합니다
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * 두 날짜 사이의 일수를 계산합니다
   */
  static getDaysBetween(startDate: string, endDate: string): number {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  }
}

// 기존 함수들과의 호환성을 위한 래퍼 함수들
export const formatDate = DateFormatter.formatDate;
export const formatDateTime = DateFormatter.formatDateTime;
export const formatExpenseDate = DateFormatter.formatExpenseDate;
export const formatDateHeader = DateFormatter.formatDateHeader;
export const formatDateForDisplay = DateFormatter.formatDateForDisplay;
export const getTodayYMD = DateFormatter.getTodayYMD;
