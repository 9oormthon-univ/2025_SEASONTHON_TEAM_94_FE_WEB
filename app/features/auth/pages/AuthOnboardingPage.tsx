import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

export default function AuthOnboardingPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 닉네임 설정 API 호출 (Swagger 스펙에 맞게 PUT 메서드 사용)
      await httpClient.put<ApiResponse<{
        id: string;
        role: string;
        username: string;
        nickname: string;
        email: string;
      }>>(API_ENDPOINTS.USERS, {
        nickname: nickname.trim()
      });

      // 온보딩 완료 후 expenses 페이지로 이동
      navigate('/expenses', { replace: true });
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('닉네임 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // 온보딩을 건너뛰고 expenses 페이지로 이동
    navigate('/expenses', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-lg">🎉</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">환영합니다!</h1>
          <p className="mt-2 text-sm text-gray-600">
            StopUsing과 함께 현명한 소비 습관을 시작해보세요
          </p>
        </div>

        {/* 온보딩 폼 */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">프로필 설정</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              사용할 닉네임을 입력해주세요
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  나중에 설정에서 변경할 수 있습니다
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? '설정 중...' : '시작하기'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  나중에 설정하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 안내 메시지 */}
        <div className="text-center text-xs text-gray-500">
          <p>
            닉네임은 언제든지 설정에서 변경할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
