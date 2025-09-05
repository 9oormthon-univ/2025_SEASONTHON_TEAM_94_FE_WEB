import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createBudgetGoal } from '@/features/onboarding/api/onboardingApi';

/**
 * 예산 목표 생성 뮤테이션을 관리하는 훅
 */
export function useBudgetGoalMutation() {
  const navigate = useNavigate();

  const createBudgetGoalMutation = useMutation({
    mutationFn: createBudgetGoal,
    onSuccess: () => {
      toast.success('목표 초과지출이 설정되었습니다.');
      navigate('/home');
    },
    onError: error => {
      console.error('목표 초과지출 설정 실패:', error);
      toast.error('목표 초과지출 설정에 실패했습니다.');
    },
  });

  const handleSubmit = async (budgetAmount: string) => {
    if (!budgetAmount) return;

    try {
      await createBudgetGoalMutation.mutateAsync({
        price: parseInt(budgetAmount),
      });
    } catch (error) {
      // 에러는 mutation에서 처리됨
    }
  };

  return {
    createBudgetGoalMutation,
    handleSubmit,
  };
}
