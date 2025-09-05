import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '@/features/expenses';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useNicknameForm } from '@/features/onboarding/hooks/useNicknameForm';
import { useAlertTimer } from '@/features/onboarding/hooks/useAlertTimer';
import { useHideNavigation } from '@/shared/hooks/useHideNav';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import AlertIcon from '@/assets/alert.svg?react';
import { getMe } from '@/features/profile/api/user';
import { updateUserNickname } from '@/features/onboarding/api/onboardingApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileNicknamePage() {
  useHideNavigation();
  const {
    nickname,
    isFormValid,
    showAlert,
    setShowAlert,
    handleNicknameChange,
    handleKeyDown,
  } = useNicknameForm();

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const qc = useQueryClient();

  useAlertTimer(showAlert, setShowAlert);

  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    (async () => {
      try {
        const me = await getMe();
        const init = (me.nickname ?? me.username ?? '').trim();
        if (init) handleNicknameChange(init);
      } catch {
      } finally {
        bootstrapped.current = true;
      }
    })();
  }, [handleNicknameChange]);

  const onSubmit = async () => {
    const value = nickname.trim();
    if (!value || !isFormValid || saving) return;

    try {
      setSaving(true);
      await updateUserNickname({ nickname: value });
      await qc.invalidateQueries({ queryKey: ['me'] });

      toast.success('닉네임이 변경되었습니다.');
      navigate('/profile');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        '닉네임 저장 중 오류가 발생했습니다.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white h-screen max-w-md mx-auto relative flex flex-col"
    >
      <Header title="닉네임 입력/수정" backPath="/profile" />

      <div className="px-5 py-8 text-start flex flex-col justify-between h-full">
        <div>
          <OnboardingHeader
            title="어떻게 불러드릴까요?"
            description="최대 7자 내의 입력하신 닉네임으로 불러드려요."
          />

          <div className="space-y-6 mt-6">
            <div>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="닉네임을 입력하세요"
                className="w-full h-14 text-base bg-gray-50 border-0 rounded-xl focus:border-main-orange focus:ring-0 transition-colors"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">최대 7자까지 입력 가능합니다</p>
                <span className="text-sm text-gray-400">{nickname.length}/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <Button
            onClick={onSubmit}
            disabled={saving || !isFormValid}
            className={`w-full h-14 text-white text-lg font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 ${
              isFormValid && !saving
                ? 'bg-main-orange hover:bg-orange-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>

      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent
          className="max-w-sm w-[calc(100%-40px)] h-32 p-6 focus:outline-none focus:ring-0 rounded-2xl"
          showCloseButton={false}
        >
          <DialogHeader className="h-full">
            <div className="flex flex-col items-center justify-center space-y-4 h-full">
              <AlertIcon />
              <DialogTitle className="text-center text-gray-800 font-medium text-base">
                닉네임은 최대 7자까지만 가능해요.
              </DialogTitle>
              <DialogDescription className="sr-only">
                닉네임 입력 제한 안내 메시지입니다.
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}