import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { ExpenseHeader } from '@/features/expenses';
import AlertIcon from '@/assets/alert.svg?react';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { useNicknameForm } from '../hooks/useNicknameForm';
import { useNicknameMutation } from '../hooks/useNicknameMutation';
import { useAlertTimer } from '../hooks/useAlertTimer';

export function NicknamePage() {
  const {
    nickname,
    isFormValid,
    showAlert,
    setShowAlert,
    handleNicknameChange,
    handleKeyDown,
  } = useNicknameForm();
  const { updateNicknameMutation, handleSubmit } = useNicknameMutation();

  useAlertTimer(showAlert, setShowAlert);

  const onSubmit = () => {
    handleSubmit(nickname);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white h-screen max-w-md mx-auto relative flex flex-col"
    >
      {/* Header */}
      <ExpenseHeader title="닉네임 입력/수정" />

      <div className="px-5 py-8 text-start flex flex-col justify-between h-full">
        <div>
          <OnboardingHeader
            title="어떻게 불러드릴까요?"
            description="최대 7자 내의 입력하신 닉네임으로 불러드려요."
          />

          {/* Form */}
          <div>
            <div className="space-y-6">
              <div>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={e => handleNicknameChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="닉네임을 입력하세요"
                  className="w-full h-14 text-base bg-[#F7F9FA] border-0 rounded-xl focus:border-main-orange focus:ring-0 transition-colors"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    최대 7자까지 입력 가능합니다
                  </p>
                  <span className="text-sm text-gray-400">
                    {nickname.length}/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="py-6">
          <Button
            onClick={onSubmit}
            disabled={updateNicknameMutation.isPending || !isFormValid}
            className={`w-full h-14 text-white text-lg font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 ${
              isFormValid && !updateNicknameMutation.isPending
                ? 'bg-main-orange hover:bg-orange-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {updateNicknameMutation.isPending ? '저장 중...' : '다음 단계'}
          </Button>
        </div>
      </div>

      {/* Alert Dialog */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent
          className="max-w-sm w-[calc(100%-40px)] h-32 p-6 focus:outline-none focus:ring-0 rounded-2xl"
          showCloseButton={false}
        >
          <DialogHeader className="h-full">
            <div className="flex flex-col items-center justify-center space-y-4 h-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <AlertIcon />
              </motion.div>
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
