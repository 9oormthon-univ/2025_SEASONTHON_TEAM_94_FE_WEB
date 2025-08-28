/**
 * 네이티브 앱과의 통신을 위한 브릿지 함수들
 * 주로 알림, 권한, 시스템 기능 등에 사용됩니다.
 */

declare global {
  interface Window {
    Android?: {
      // 알림 관련
      showNotification?: (title: string, message: string) => void;
      requestNotificationPermission?: () => boolean;

      // 시스템 관련
      getAppVersion?: () => string;
      isNetworkAvailable?: () => boolean;

      // 기타
      shareContent?: (title: string, content: string) => void;
      openExternalUrl?: (url: string) => void;
    };
  }
}

/**
 * 네이티브 알림 표시
 */
export function showNativeNotification(title: string, message: string): void {
  if (typeof window !== 'undefined' && window.Android?.showNotification) {
    window.Android.showNotification(title, message);
  } else {
    console.log('Native notification (fallback):', { title, message });
  }
}

/**
 * 알림 권한 요청
 */
export function requestNotificationPermission(): boolean {
  if (
    typeof window !== 'undefined' &&
    window.Android?.requestNotificationPermission
  ) {
    return window.Android.requestNotificationPermission();
  }
  return false;
}

/**
 * 앱 버전 정보 조회
 */
export function getAppVersion(): string {
  if (typeof window !== 'undefined' && window.Android?.getAppVersion) {
    return window.Android.getAppVersion();
  }
  return 'Web Version';
}

/**
 * 네트워크 연결 상태 확인
 */
export function isNetworkAvailable(): boolean {
  if (typeof window !== 'undefined' && window.Android?.isNetworkAvailable) {
    return window.Android.isNetworkAvailable();
  }
  // 웹에서는 navigator.onLine 사용
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * 콘텐츠 공유
 */
export function shareContent(title: string, content: string): void {
  if (typeof window !== 'undefined' && window.Android?.shareContent) {
    window.Android.shareContent(title, content);
  } else if (typeof navigator !== 'undefined' && navigator.share) {
    // Web Share API 사용
    navigator.share({ title, text: content });
  } else {
    // 대체 방법 (클립보드 복사 등)
    console.log('Share content (fallback):', { title, content });
  }
}

/**
 * 외부 URL 열기
 */
export function openExternalUrl(url: string): void {
  if (typeof window !== 'undefined' && window.Android?.openExternalUrl) {
    window.Android.openExternalUrl(url);
  } else {
    // 웹에서는 새 탭에서 열기
    window.open(url, '_blank');
  }
}
