import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { sendAuthDataToNative } from '@/shared/utils/nativeBridge';
import { httpClient, HttpError } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    const handleAuthCallback = async () => {
      const maxAttempts = 5;
      const baseDelay = 250; // ms
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          // 서버에 세션(쿠키) 기반 인증 여부 확인
          const response = await httpClient.get<
            ApiResponse<{
              id: string;
              role: string;
              username: string;
              nickname: string;
              email: string;
            }>
          >(API_ENDPOINTS.USERS_ME);

          const userData = response.data;

          // 네이티브 앱에 사용자 정보 전달
          sendAuthDataToNative({
            uid: userData.id || 'unknown',
            username: userData.username || userData.nickname || 'unknown',
          });

          // 신규/기존 유저 판별 후 라우팅
          const isNewUser =
            !userData.nickname ||
            userData.nickname === userData.username ||
            userData.nickname.trim() === '';

          setStatus('success');
          if (isNewUser) {
            navigate('/auth/onboarding', { replace: true });
          } else {
            navigate('/home', { replace: true });
          }
          return;
        } catch (error) {
          const shouldRetry = attempt < maxAttempts;
          console.warn(
            `[AuthCallback] USERS_ME failed (attempt ${attempt}/${maxAttempts}).`,
            error
          );
          if (shouldRetry) {
            await new Promise(r => setTimeout(r, baseDelay * attempt));
            continue;
          }
          // 재시도 후에도 실패 시: 401/403은 인증 실패로 간주, 그 외(예: 500)는 우회 성공 처리
          if (
            error instanceof HttpError &&
            (error.status === 401 || error.status === 403)
          ) {
            setStatus('error');
            setTimeout(() => navigate('/auth', { replace: true }), 1500);
            return;
          }
          // 우회 성공: 일단 앱 진입 후 내부 페이지에서 복구 시도
          setStatus('success');
          navigate('/home', { replace: true });
          return;
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <h2 className="text-lg font-semibold text-gray-900">
              로그인 처리 중...
            </h2>
            <p className="text-sm text-gray-600">잠시만 기다려주세요</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              로그인 성공!
            </h2>
            <p className="text-sm text-gray-600">
              페이지를 이동하고 있습니다...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">로그인 실패</h2>
            <p className="text-sm text-gray-600">
              로그인 페이지로 돌아갑니다...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
