import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUserNickname } from '../api/onboardingApi';

/**
 * 닉네임 업데이트 뮤테이션을 관리하는 훅
 */
export function useNicknameMutation() {
  const navigate = useNavigate();

  const updateNicknameMutation = useMutation({
    mutationFn: updateUserNickname,
    onSuccess: () => {
      toast.success('닉네임이 설정되었습니다.');
      navigate('/onboarding/budget-goal');
    },
    onError: error => {
      console.error('닉네임 설정 실패:', error);
      toast.error('닉네임 설정에 실패했습니다.');
    },
  });

  const handleSubmit = async (nickname: string) => {
    if (!nickname.trim()) return;

    try {
      await updateNicknameMutation.mutateAsync({ nickname: nickname.trim() });
    } catch (error) {
      // 에러는 mutation에서 처리됨
    }
  };

  return {
    updateNicknameMutation,
    handleSubmit,
  };
}
