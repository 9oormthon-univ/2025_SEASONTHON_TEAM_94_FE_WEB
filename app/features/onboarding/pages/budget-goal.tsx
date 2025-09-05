import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Header } from '@/features/expenses';
import { useBudgetGoalForm } from '@/features/onboarding/hooks/useBudgetGoalForm';
import { useBudgetGoalMutation } from '@/features/onboarding/hooks/useBudgetGoalMutation';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';

export function BudgetGoalPage() {
  const { budgetAmount, isFormValid, formattedAmount, handleKeyDown } =
    useBudgetGoalForm();
  const { createBudgetGoalMutation, handleSubmit } = useBudgetGoalMutation();

  const onSubmit = () => {
    handleSubmit(budgetAmount);
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
      <Header title="목표 지출 설정" backPath="/onboarding/nickname" />

      <div className="px-5 py-8 text-start flex flex-col justify-between h-full">
        <div>
          <OnboardingHeader
            title="이번 달에 얼마까지 지출할 건가요?"
            description="이 금액은 온전히 통제해보세요."
          />

          {/* Form */}
          <div>
            <div className="space-y-6">
              <div>
                <Input
                  id="budgetAmount"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formattedAmount}
                  onKeyDown={handleKeyDown}
                  placeholder="목표 지출 금액을 입력하세요."
                  className="w-full h-14 text-base bg-gray-50 border-0 rounded-xl focus:border-main-orange focus:ring-0 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="py-6">
          <Button
            onClick={onSubmit}
            disabled={createBudgetGoalMutation.isPending || !isFormValid}
            className={`w-full h-14 text-white text-lg font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 ${
              isFormValid && !createBudgetGoalMutation.isPending
                ? 'bg-main-orange hover:bg-orange-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {createBudgetGoalMutation.isPending ? '저장 중...' : '다음 단계'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
