import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { httpClient, HttpError } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 로그인하지 않은 사용자는 auth 페이지로 리다이렉트
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<'checking' | 'authed' | 'unauthed'>('checking');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 서버에 세션(쿠키) 기반 인증 여부 확인
        await httpClient.get<ApiResponse<any>>(API_ENDPOINTS.USERS_ME);
        if (!mounted) return;
        setAuthState('authed');
      } catch (error) {
        if (!mounted) return;
        if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
          setAuthState('unauthed');
          navigate('/auth', { replace: true });
        } else {
          // 5xx 등은 일단 앱 접근 허용 (내부에서 재시도/안내)
          setAuthState('authed');
        }
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  // 로딩 상태 표시 (간단한 스켈레톤)
  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (authState === 'unauthed') {
    return null;
  }

  console.log('[AuthGuard] 인증됨, children 렌더링');
  return <>{children}</>;
}
