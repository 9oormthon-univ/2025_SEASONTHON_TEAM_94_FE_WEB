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
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  
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
export function isAuthenticated(): boolean {
  const token = getCookie('Authorization');
  return !!token;
}
