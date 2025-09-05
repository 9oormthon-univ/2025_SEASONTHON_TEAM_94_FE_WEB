/**
 * Flutter 웹뷰와의 통신을 위한 브릿지 함수들
 * Flutter MethodChannel을 통한 양방향 통신을 지원합니다.
 */

declare global {
  interface Window {
    Flutter?: {
      // Flutter MethodChannel 통신
      postMessage?: (message: string) => void;
    };
  }
}

// Flutter 통신 메시지 타입 정의
interface FlutterMessage {
  action: string;
  data: any;
}

interface FlutterResponse {
  action: string;
  data: any;
}

/**
 * Flutter로 메시지 전송
 */
async function sendToFlutter(
  message: FlutterMessage
): Promise<FlutterResponse | null> {
  if (typeof window === 'undefined' || !window.Flutter?.postMessage) {
    console.log('Flutter bridge not available (fallback):', message);
    return null;
  }

  try {
    const messageString = JSON.stringify(message);
    window.Flutter.postMessage(messageString);

    // Flutter에서 응답을 받기 위한 Promise 반환
    return new Promise(resolve => {
      // Flutter에서 응답을 받는 이벤트 리스너 (실제 구현은 Flutter 측에서 처리)
      const handleResponse = (event: MessageEvent) => {
        try {
          const response: FlutterResponse = JSON.parse(event.data);
          if (response.action) {
            resolve(response);
            window.removeEventListener('message', handleResponse);
          }
        } catch (error) {
          console.error('Failed to parse Flutter response:', error);
        }
      };

      window.addEventListener('message', handleResponse);

      // 타임아웃 설정 (5초)
      setTimeout(() => {
        window.removeEventListener('message', handleResponse);
        resolve(null);
      }, 5000);
    });
  } catch (error) {
    console.error('Failed to send message to Flutter:', error);
    return null;
  }
}

/**
 * 네이티브 알림 표시
 */
export function showNativeNotification(title: string, message: string): void {
  sendToFlutter({
    action: 'SHOW_NOTIFICATION',
    data: { title, message },
  });
}

/**
 * 알림 권한 요청
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const response = await sendToFlutter({
    action: 'REQUEST_NOTIFICATION_PERMISSION',
    data: {},
  });
  return response?.data === true;
}

/**
 * 앱 버전 정보 조회
 */
export async function getAppVersion(): Promise<string> {
  const response = await sendToFlutter({
    action: 'GET_APP_VERSION',
    data: {},
  });
  return response?.data || 'Web Version';
}

/**
 * 네트워크 연결 상태 확인
 */
export async function isNetworkAvailable(): Promise<boolean> {
  const response = await sendToFlutter({
    action: 'IS_NETWORK_AVAILABLE',
    data: {},
  });
  return response?.data === true;
}

/**
 * 콘텐츠 공유
 */
export function shareContent(title: string, content: string): void {
  sendToFlutter({
    action: 'SHARE_CONTENT',
    data: { title, content },
  });
}

/**
 * 외부 URL 열기
 */
export function openExternalUrl(url: string): void {
  sendToFlutter({
    action: 'OPEN_EXTERNAL_URL',
    data: { url },
  });
}

/**
 * Flutter에 사용자 UID 설정 요청
 * Flutter MethodChannel을 통해 사용자 UID를 전달합니다.
 */
export async function setUserUidToFlutter(uid: string): Promise<boolean> {
  try {
    const response = await sendToFlutter({
      action: 'SET_USER_UID',
      data: uid,
    });

    if (response?.data === true) {
      console.log('User UID set successfully in Flutter:', uid);
      return true;
    } else {
      console.warn('Failed to set user UID in Flutter:', response);
      return false;
    }
  } catch (error) {
    console.error('Failed to send user UID to Flutter:', error);
    return false;
  }
}

/**
 * Flutter에 인증 성공 정보 전달 (기존 호환성 유지)
 */
export async function sendAuthDataToNative(userData: {
  uid: string;
  username: string;
}): Promise<boolean> {
  try {
    // Flutter에 사용자 UID 설정
    const success = await setUserUidToFlutter(userData.uid);

    if (success) {
      console.log('Auth data sent to Flutter:', userData);
      return true;
    } else {
      console.warn('Failed to send auth data to Flutter');
      return false;
    }
  } catch (error) {
    console.error('Failed to send auth data to Flutter:', error);
    return false;
  }
}
