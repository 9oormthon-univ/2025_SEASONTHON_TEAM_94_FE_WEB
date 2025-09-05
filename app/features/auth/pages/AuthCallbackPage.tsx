import { useAuthCallback } from '../hooks/useAuthCallback';
import { AuthLogo } from '../components/AuthLogo';

export default function AuthCallbackPage() {
  const { status } = useAuthCallback();

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center p-6">
      {/* 중앙 로고 영역 */}
      <div className="flex-1 flex items-center justify-center">
        <AuthLogo />
      </div>

      {/* 하단 상태 메시지 영역 */}
      <div className="w-full max-w-sm text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <h2 className="text-lg font-semibold text-white">
              로그인 처리 중...
            </h2>
            <p className="text-sm text-white/80">잠시만 기다려주세요</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
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
            <h2 className="text-lg font-semibold text-white">로그인 성공!</h2>
            <p className="text-sm text-white/80">
              페이지를 이동하고 있습니다...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
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
            <h2 className="text-lg font-semibold text-white">로그인 실패</h2>
            <p className="text-sm text-white/80">
              로그인 페이지로 돌아갑니다...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
