import { Button } from '@/shared/components/ui/button';
import { AuthLogo } from '@/features/auth/components/AuthLogo';
import KakaoIcon from '@/assets/kakao.svg?react';
import GoogleIcon from '@/assets/google.svg?react';

const KAKAO_LOGIN_URL =
  'https://api.stopusing.klr.kr/oauth2/authorization/kakao';
const GOOGLE_LOGIN_URL =
  'https://api.stopusing.klr.kr/oauth2/authorization/google';

export default function AuthPage() {
  const handleKakaoLogin = () => {
    // 카카오 로그인 URL로 이동
    window.location.href = KAKAO_LOGIN_URL;
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 URL로 이동
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-between p-6">
      {/* 중앙 로고 영역 */}
      <div className="flex-1 flex items-center justify-center">
        <AuthLogo />
      </div>

      {/* 하단 로그인 버튼 영역 */}
      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={handleKakaoLogin}
          className="w-full h-14 bg-[#FEE500] justify-center text-black text-base font-bold rounded-xl flex items-center space-x-3"
          size="lg"
        >
          <KakaoIcon style={{ width: 24, height: 24 }} />
          <span>카카오로 계속하기</span>
        </Button>

        <Button
          onClick={handleGoogleLogin}
          className="w-full h-14 bg-white justify-center text-black text-base font-bold rounded-xl flex items-center space-x-3"
          size="lg"
        >
          <GoogleIcon style={{ width: 24, height: 24 }} />
          <span>구글로 계속하기</span>
        </Button>
      </div>
    </div>
  );
}
