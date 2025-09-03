/**
 * 브라우저 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
 * @param name 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  console.log('[Cookie Debug] getCookie 호출:', {
    cookieName: name,
    allCookies: document.cookie,
    splitResult: parts.length,
    foundCookie: parts.length === 2
  });
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    console.log('[Cookie Debug] 쿠키 값 찾음:', cookieValue);
    return cookieValue || null;
  }
  
  console.log('[Cookie Debug] 쿠키를 찾을 수 없음');
  return null;
}

/**
 * 쿠키를 설정하는 함수
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param days 만료 일수 (선택사항)
 */
export function setCookie(name: string, value: string, days?: number): void {
  if (typeof document === 'undefined') {
    return;
  }

  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${name}=${value}${expires}; path=/`;
}

/**
 * 쿠키를 삭제하는 함수
 * @param name 쿠키 이름
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Authorization 쿠키가 존재하는지 확인하는 함수
 * @returns 로그인 상태 여부
 */
// 더 이상 JS 쿠키 읽기로 인증 여부를 판단하지 않습니다.
// HttpOnly/도메인 분리 환경에서 오탐이 발생하므로 서버 확인(API: USERS_ME)을 사용하세요.
export function isAuthenticated(): boolean {
  return false;
}

/**
 * 모든 인증 관련 쿠키를 삭제하는 함수
 */
export function clearAuthCookies(): void {
  console.log('[Cookie Debug] clearAuthCookies 호출됨');
  console.log('[Cookie Debug] 삭제 전 쿠키:', document.cookie);
  
  deleteCookie('Authorization');
  deleteCookie('JSESSIONID');
  deleteCookie('SESSIONID');
  
  // 추가적으로 혹시 설정된 다른 인증 쿠키들도 삭제
  const authCookieNames = ['auth', 'session', 'token', 'access_token', 'refresh_token'];
  authCookieNames.forEach(name => deleteCookie(name));
  
  console.log('[Cookie Debug] 삭제 후 쿠키:', document.cookie);
}
