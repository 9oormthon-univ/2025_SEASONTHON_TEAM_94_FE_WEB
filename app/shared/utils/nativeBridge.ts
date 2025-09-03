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

      // 인증 관련
      onAuthSuccess?: (uid: string, username: string) => void;

      // 기타
      shareContent?: (title: string, content: string) => void;
      openExternalUrl?: (url: string) => void;
    };
    webkit?: {
      messageHandlers?: {
        authHandler?: {
          postMessage: (message: any) => void;
        };
      };
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

/**
 * 네이티브 앱에 인증 성공 정보 전달
 * iOS와 Android 모두 지원
 */
export function sendAuthDataToNative(userData: { uid: string; username: string }): void {
  try {
    // Android 환경
    if (typeof window !== 'undefined' && window.Android?.onAuthSuccess) {
      window.Android.onAuthSuccess(userData.uid, userData.username);
      console.log('Auth data sent to Android:', userData);
      return;
    }

    // iOS 환경 (WebKit)
    if (typeof window !== 'undefined' && window.webkit?.messageHandlers?.authHandler) {
      const message = {
        type: 'AUTH_SUCCESS',
        data: userData
      };
      window.webkit.messageHandlers.authHandler.postMessage(message);
      console.log('Auth data sent to iOS:', userData);
      return;
    }

    // 웹 환경에서의 대체 처리 (개발/테스트용)
    console.log('Auth data (web fallback):', userData);
  } catch (error) {
    console.error('Failed to send auth data to native:', error);
  }
}
