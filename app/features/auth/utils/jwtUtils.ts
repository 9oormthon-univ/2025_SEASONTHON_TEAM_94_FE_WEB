import { jwtDecode } from 'jwt-decode';
import type { JWTPayload } from '@/shared/types/auth';
import { getCookie } from '@/shared/utils/cookie';

/**
 * JWT 토큰을 디코딩하여 payload를 반환하는 함수
 * @param token JWT 토큰 문자열
 * @returns JWT Payload 또는 null
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * 현재 저장된 Authorization 쿠키를 디코딩하여 사용자 정보를 반환
 * @returns 사용자 정보 또는 null
 */
export function getCurrentUserFromToken(): { uid: string; username: string } | null {
  const token = getCookie('Authorization');
  
  if (!token) {
    return null;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  return {
    uid: payload.uid,
    username: payload.username
  };
}

/**
 * JWT 토큰이 만료되었는지 확인하는 함수
 * @param token JWT 토큰 문자열
 * @returns 만료 여부
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * 현재 저장된 Authorization 토큰이 유효한지 확인
 * @returns 토큰 유효성 여부
 */
export function isValidToken(): boolean {
  const token = getCookie('Authorization');
  
  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
}
