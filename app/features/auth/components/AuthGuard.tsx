import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { isAuthenticated } from '@/shared/utils/cookie';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 로그인하지 않은 사용자는 auth 페이지로 리다이렉트
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  // 인증된 경우에만 children 렌더링
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm text-gray-600">인증 확인 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}
