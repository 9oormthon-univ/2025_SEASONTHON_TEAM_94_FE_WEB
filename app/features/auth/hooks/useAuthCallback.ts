import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { sendAuthDataToNative } from '@/shared/utils/nativeBridge';
import { httpClient, HttpError } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

type AuthStatus = 'loading' | 'success' | 'error';

interface UserData {
  id: string;
  role: string;
  username: string;
  nickname: string;
  email: string;
  isRegistered: boolean;
}

const MAX_ATTEMPTS = 5;
const BASE_DELAY = 250; // ms

export function useAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          // 서버에 세션(쿠키) 기반 인증 여부 확인
          const response = await httpClient.get<ApiResponse<UserData>>(
            API_ENDPOINTS.USERS_ME,
            undefined,
            { retries: 0 }
          );

          const userData = response.data;

          // 네이티브 앱에 사용자 정보 전달
          sendAuthDataToNative({
            uid: userData.id || 'unknown',
            username: userData.username || userData.nickname || 'unknown',
          });

          // isRegistered 필드로 최초로그인/기존로그인 판별 후 라우팅
          setStatus('success');
          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            if (userData.isRegistered) {
              navigate('/home', { replace: true });
            } else {
              navigate('/onboarding/nickname', { replace: true });
            }
          }
          return;
        } catch (error) {
          const shouldRetry = attempt < MAX_ATTEMPTS;
          console.warn(
            `[AuthCallback] USERS_ME failed (attempt ${attempt}/${MAX_ATTEMPTS}).`,
            error
          );

          if (shouldRetry) {
            await new Promise(r => setTimeout(r, BASE_DELAY * attempt));
            continue;
          }

          // 재시도 후에도 실패 시: 401/403은 인증 실패로 간주, 그 외(예: 500)는 우회 성공 처리
          if (
            error instanceof HttpError &&
            (error.status === 401 || error.status === 403)
          ) {
            setStatus('error');
            if (!hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              setTimeout(() => navigate('/auth', { replace: true }), 1500);
            }
            return;
          }

          // 우회 성공: 일단 앱 진입 후 내부 페이지에서 복구 시도
          setStatus('success');
          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            navigate('/home', { replace: true });
          }
          return;
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return { status };
}
