import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

const KAKAO_LOGIN_URL = 'https://api.stopusing.klr.kr/oauth2/authorization/kakao';

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인된 상태라면 expense 페이지로 리다이렉트 (서버 확인)
    (async () => {
      try {
        await httpClient.get<ApiResponse<any>>(API_ENDPOINTS.USERS_ME);
        navigate('/expenses', { replace: true });
      } catch {
        // not authed → stay
      }
    })();
  }, [navigate]);

  const handleKakaoLogin = () => {
    // 카카오 로그인 URL로 이동
    window.location.href = KAKAO_LOGIN_URL;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* 로고 및 헤더 영역 */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">StopUsing</h1>
          <p className="mt-2 text-sm text-gray-600">
            가계부로 시작하는 현명한 소비 습관
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">로그인</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              소셜 계정으로 간편하게 시작하세요
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleKakaoLogin}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
              size="lg"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
              </svg>
              <span>카카오로 시작하기</span>
            </Button>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <div className="text-center text-xs text-gray-500">
          <p>
            로그인 시 서비스 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
