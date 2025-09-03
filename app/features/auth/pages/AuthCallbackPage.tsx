import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getCookie } from '@/shared/utils/cookie';
import { getCurrentUserFromToken, isValidToken } from '../utils/jwtUtils';
import { sendAuthDataToNative } from '@/shared/utils/nativeBridge';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 1. 쿠키에서 Authorization 토큰 읽기
        const accessToken = getCookie('Authorization');
        
        if (!accessToken) {
          console.log('No access token found in cookies');
          setStatus('error');
          // 로그인 실패 시 auth 페이지로 리다이렉트
          setTimeout(() => navigate('/auth', { replace: true }), 2000);
          return;
        }

        // 2. JWT 토큰 유효성 검증
        if (!isValidToken()) {
          console.log('Invalid or expired token');
          setStatus('error');
          setTimeout(() => navigate('/auth', { replace: true }), 2000);
          return;
        }

        // 3. JWT에서 사용자 정보 추출
        const userInfo = getCurrentUserFromToken();
        
        if (!userInfo) {
          console.log('Failed to extract user info from token');
          setStatus('error');
          setTimeout(() => navigate('/auth', { replace: true }), 2000);
          return;
        }

        // 4. 네이티브 앱에 사용자 정보 전달
        sendAuthDataToNative({
          uid: userInfo.uid,
          username: userInfo.username
        });

        // 5. 사용자 정보를 통해 신규/기존 유저 판별을 위한 API 호출
        try {
          const response = await fetch('/api/v1/users/me', {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const userData = await response.json();
            
            // 응답 데이터를 기반으로 신규/기존 유저 판별
            // 백엔드 응답 구조에 따라 조건을 조정해야 할 수 있습니다
            const isNewUser = userData.isNewUser || !userData.nickname || userData.createdAt === userData.updatedAt;
            
            setStatus('success');
            
            if (isNewUser) {
              // 신규 유저는 온보딩 페이지로
              navigate('/auth/onboarding', { replace: true });
            } else {
              // 기존 유저는 expense 페이지로
              navigate('/expenses', { replace: true });
            }
          } else {
            // API 호출 실패 시, 기본적으로 expense 페이지로 이동
            console.warn('Failed to fetch user info, redirecting to expenses');
            setStatus('success');
            navigate('/expenses', { replace: true });
          }
        } catch (apiError) {
          // API 에러 시에도 기본적으로 expense 페이지로 이동
          console.warn('API call error, redirecting to expenses:', apiError);
          setStatus('success');
          navigate('/expenses', { replace: true });
        }

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setTimeout(() => navigate('/auth', { replace: true }), 2000);
      }
    };

    // 페이지 로드 시 인증 콜백 처리 실행
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <h2 className="text-lg font-semibold text-gray-900">로그인 처리 중...</h2>
            <p className="text-sm text-gray-600">잠시만 기다려주세요</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">로그인 성공!</h2>
            <p className="text-sm text-gray-600">페이지를 이동하고 있습니다...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">`로그인 실패`</h2>
            <p className="text-sm text-gray-600">로그인 페이지로 돌아갑니다...</p>
          </>
        )}
      </div>
    </div>
  );
}
