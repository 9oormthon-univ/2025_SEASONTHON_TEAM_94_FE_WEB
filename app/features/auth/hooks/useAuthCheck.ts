import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { httpClient, HttpError } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

interface UseAuthCheckOptions {
  redirectPath?: string;
}

type AuthState = 'checking' | 'authed' | 'unauthed';

export function useAuthCheck({ redirectPath = '/auth' }: UseAuthCheckOptions) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>('checking');
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const isAuthPage = location.pathname === '/auth';
    const isAuthCallback = location.pathname.startsWith('/auth/callback');
    const isOnboarding = location.pathname.startsWith('/onboarding');
    const isPublic = isAuthPage || isAuthCallback || isOnboarding;

    const checkAuthStatus = async () => {
      try {
        await httpClient.get<ApiResponse<any>>(
          API_ENDPOINTS.USERS_ME,
          undefined,
          { retries: 0 }
        );
        if (!mounted) return;

        setAuthState('authed');

        // 로그인된 사용자가 /auth 페이지에 접근한 경우 /home으로 리다이렉트
        if (isAuthPage && !hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigate('/home', { replace: true });
        }
      } catch (error) {
        if (!mounted) return;

        if (
          error instanceof HttpError &&
          (error.status === 401 || error.status === 403)
        ) {
          setAuthState('unauthed');

          // 현재 페이지가 공개 페이지가 아닌 경우에만 리다이렉트
          if (!isPublic && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            navigate(redirectPath, { replace: true });
          }
        } else {
          // 5xx/네트워크 오류 등도 보수적으로 미인증 처리
          setAuthState('unauthed');

          if (!isPublic && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            navigate(redirectPath, { replace: true });
          }
        }
      }
    };

    // 공개 페이지에서는 API 호출하지 않고 상태만 설정
    if (isPublic) {
      // /auth는 비로그인 유지, 콜백/온보딩은 자체 로직에서 처리되므로 checking 유지
      setAuthState(isAuthPage ? 'unauthed' : 'checking');
      return;
    }

    checkAuthStatus();
    return () => {
      mounted = false;
    };
  }, [navigate, redirectPath, location.pathname]);

  return { authState };
}
