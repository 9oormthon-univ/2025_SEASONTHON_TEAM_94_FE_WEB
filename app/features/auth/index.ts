export { default as AuthPage } from './pages/AuthPage';
export { default as AuthCallbackPage } from './pages/AuthCallbackPage';
export { default as AuthOnboardingPage } from './pages/AuthOnboardingPage';
export { AuthGuard } from './components/AuthGuard';

// 쿠키 기반 인증으로 변경되면서 jwtUtils는 더 이상 export하지 않습니다.
// 인증 관련 함수들은 @/shared/utils/cookie.ts에서 import하세요.
