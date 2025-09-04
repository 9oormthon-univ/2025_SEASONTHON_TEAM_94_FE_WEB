import { useNavigate, useParams } from 'react-router';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { 
  useExpenseDetail, 
  useUpdateExpense, 
  useDeleteExpense 
} from '@/features/expenses/hooks';
import { EXPENSE_TYPES, type TransactionUpdateRequest } from '@/shared/types/expense';
import { ExpenseForm } from '@/features/expenses/components/Form/ExpenseForm';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';
import { toLocalISOString } from '@/shared/utils/utils';

export function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  const expenseIdNum = expenseId ? Number(expenseId) : 0;

  // TanStack Query 훅들 사용
  const { data: expense, isLoading: loading, error } = useExpenseDetail(expenseIdNum);
  const updateExpenseMutation = useUpdateExpense();
  const deleteExpenseMutation = useDeleteExpense();

  // 폼 기본값 설정
  const defaultValues = useMemo(() => {
    if (!expense) return null;

    return {
      userUid: expense.userUid,
      title: expense.title,
      price: expense.price,
      selectedDate: new Date(expense.startedAt),
      type: expense.type,
      category: expense.category,
      app: '', // API에서 app 정보가 없으므로 빈 문자열
      dutchPayCount: 1, // 기본값
    };
  }, [expense]);

  // 폼 제출 핸들러
  const handleFormSubmit = async (formData: ExpenseFormData) => {
    if (!expense) return;

    try {
      // 더치페이 적용된 실제 금액 계산
      const finalAmount =
        formData.dutchPayCount > 1
          ? Math.floor(formData.price / formData.dutchPayCount)
          : formData.price;

      const updateData: TransactionUpdateRequest = {
        price: finalAmount,
        startAt: toLocalISOString(formData.selectedDate),
        title: formData.title,
        bankName: formData.bankName || expense.bankName,
        splitCount: formData.dutchPayCount,
        type: formData.type,
        category: formData.category,
      };

      await updateExpenseMutation.mutateAsync({
        id: expense.id,
        data: updateData,
      });

      // 성공 시 목록으로 돌아가기
      const nextTab = formData.type === EXPENSE_TYPES.NONE ? 'unclassified' : 'classified';
      navigate(`/expenses?tab=${nextTab}`);
    } catch (error) {
      // 에러는 mutation 훅에서 toast로 처리됨
      console.error('지출 수정 실패:', error);
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!expense) return;

    try {
      await deleteExpenseMutation.mutateAsync(expense.id);

      // 성공 시 목록으로 돌아가기
      const nextTab = expense.type === EXPENSE_TYPES.NONE ? 'unclassified' : 'classified';
      navigate(`/expenses?tab=${nextTab}`);
    } catch (error) {
      // 에러는 mutation 훅에서 toast로 처리됨
      console.error('지출 삭제 실패:', error);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-sub-blue"></div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error ? error.message : '지출을 불러오는데 실패했습니다.'}
          </p>
          <Button onClick={() => navigate('/expenses')}>목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!expense || !defaultValues) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">지출 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/expenses')}>목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white min-h-screen max-w-md mx-2 relative flex flex-col"
    >
      {/* Header */}
      <ExpenseHeader title="지출 수정" />

      {/* Form */}
      <div className="flex-1">
        <ExpenseForm
          onSubmit={handleFormSubmit}
          onValidationChange={setIsFormValid}
          defaultValues={defaultValues}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 py-4 mt-auto mb-16">
        <div className="flex gap-3">
          {/* 삭제 버튼 */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="flex-1"
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-[52px] text-base font-bold text-sub-gray border-sub-gray hover:bg-red-50 transition-colors rounded-[10px]"
                  disabled={deleteExpenseMutation.isPending}
                >
                  삭제
                </Button>
              </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>지출 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  이 지출을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 transition-colors"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
          </motion.div>

          {/* 수정 버튼 */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="flex-1"
          >
            <Button
              form="expense-form"
              type="submit"
              disabled={updateExpenseMutation.isPending || !isFormValid}
              className={`w-full h-[52px] text-white text-base font-bold rounded-[10px] disabled:opacity-50 transition-colors ${
                isFormValid && !updateExpenseMutation.isPending
                  ? 'bg-main-orange'
                  : 'bg-[#EDEDED] text-gray-400 cursor-not-allowed hover:bg-[#EDEDED]'
              }`}
            >
              {updateExpenseMutation.isPending ? '수정 중...' : '수정'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
