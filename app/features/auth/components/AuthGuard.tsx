import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { useAuthCheck } from '@/features/auth/hooks/useAuthCheck';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 모든 페이지의 인증을 처리하는 컴포넌트
 * - 로그인된 사용자가 /auth 접근 시 → /home으로 리다이렉트
 * - 로그인하지 않은 사용자가 보호된 페이지 접근 시 → /auth로 리다이렉트
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const { authState } = useAuthCheck({ redirectPath: '/auth' });

  // 공개 페이지 정의
  const publicPaths = ['/auth', '/auth/callback', '/onboarding'];
  const isPublicPath = publicPaths.some(path =>
    location.pathname.startsWith(path)
  );

  // 로딩 상태 표시 (간단한 스켈레톤) - 공개 경로는 자식 그대로 렌더링
  if (authState === 'checking') {
    if (isPublicPath) {
      return <>{children}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // 로그인된 사용자가 공개 페이지(/auth)에 접근한 경우
  if (authState === 'authed' && isPublicPath) {
    return null; // useAuthCheck에서 이미 리다이렉트 처리됨
  }

  // 로그인하지 않은 사용자가 보호된 페이지에 접근한 경우
  if (authState === 'unauthed' && !isPublicPath) {
    return null; // useAuthCheck에서 이미 리다이렉트 처리됨
  }

  // 정상적인 경우: children 렌더링
  return <>{children}</>;
}
