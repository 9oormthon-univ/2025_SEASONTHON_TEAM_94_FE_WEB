import { motion } from 'motion/react';
import { useEffect, useMemo } from 'react';
import { Header } from '@/features/expenses';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useBudgetGoal } from '@/features/reports/hooks/useBudgetGoal';
import { useHideNav } from '@/shared/hooks/useHideNav';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudgetGoal } from '@/features/onboarding/api/onboardingApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function toDigits(v: string) {
  return v.replace(/[^\d]/g, '');
}

export default function ProfileBudgetGoalPage() {
  useHideNav();

  // 기존 목표 금액 불러오기
  const { loading, price, setPrice } = useBudgetGoal({
    date: undefined,
    idFromRoute: undefined,
  });

  const isFormValid = useMemo(() => price > 0, [price]);
  const formattedAmount = useMemo(
    () => (price ? price.toLocaleString() : ''),
    [price]
  );

  const onChangeAmount = (s: string) => {
    const n = Number(toDigits(s) || '0');
    setPrice(n);
  };

  const navigate = useNavigate();
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createBudgetGoal,
    onSuccess: async () => {
      toast.success('목표 초과지출이 설정되었습니다.');
      await Promise.allSettled([
        qc.invalidateQueries({ queryKey: ['home'] }),
        qc.invalidateQueries({ queryKey: ['me'] }),
      ]);
      navigate('/profile');
    },
    onError: (err) => {
      console.error('목표 초과지출 설정 실패:', err);
      toast.error('목표 초과지출 설정에 실패했습니다.');
    },
  });

  const onSubmit = async () => {
    if (!isFormValid || loading || isPending) return;
    await mutateAsync({ price }); 
  };

  useEffect(() => {
    const id = 'hide-global-bottom-fixed';
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `nav.fixed.bottom-0.left-0.right-0{ display:none !important; }`;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white h-screen max-w-md mx-auto relative flex flex-col"
    >
      <Header title="목표 지출 설정" backPath="/profile" />

      <div className="px-5 py-8 text-start flex flex-col justify-between h-full">
        <div>
          <OnboardingHeader
            title="이번 달에 얼마까지 지출할 건가요?"
            description="이 금액은 온전히 통제해보세요."
          />

          <div className="space-y-6 mt-6">
            <div>
              <Input
                id="budgetAmount"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formattedAmount}
                onChange={(e) => onChangeAmount(e.target.value)}
                placeholder="목표 지출 금액을 입력하세요."
                className="w-full h-14 text-base bg-gray-50 border-0 rounded-xl focus:border-main-orange focus:ring-0 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="py-6">
          <Button
            onClick={onSubmit}
            disabled={loading || isPending || !isFormValid}
            className={`w-full h-14 text-white text-lg font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 ${
              isFormValid && !isPending && !loading
                ? 'bg-main-orange hover:bg-orange-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPending ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
