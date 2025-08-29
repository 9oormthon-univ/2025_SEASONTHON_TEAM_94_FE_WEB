import { useNavigate, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
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
import { useExpenses } from '@/features/expenses/hooks/useExpenses';
import { EXPENSE_TYPES, type Transaction, type TransactionUpdateRequest } from '@/shared/types/expense';
import { MOCK_USER_UID } from '@/shared/config/api';
import { fetchTransactionById } from '@/features/expenses/api/expenseApi';
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm';
import type { ExpenseFormData } from '@/features/expenses/utils/validation';
import { toLocalISOString } from '@/shared/utils/utils';

export function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const { updateExpense, deleteExpense } = useExpenses();
  const [expense, setExpense] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const userUid = MOCK_USER_UID; // 실제로는 사용자 인증에서 가져옴

  useEffect(() => {
    const loadExpense = async () => {
      if (!expenseId) {
        setError('지출 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchTransactionById(userUid, Number(expenseId));
        setExpense(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '지출을 불러오는데 실패했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpense();
  }, [expenseId, userUid]);

  const handleFormSubmit = async (formData: ExpenseFormData) => {
    if (!expense) return;

    setIsUpdating(true);
    try {
      // 더치페이 적용된 실제 금액 계산
      const finalAmount =
        formData.dutchPayCount > 1
          ? Math.floor(formData.price / formData.dutchPayCount)
          : formData.price;

      const updateData: TransactionUpdateRequest = {
        price: finalAmount,
        title: formData.title,
        type: formData.type,
        category: formData.category,
        startAt: toLocalISOString(formData.selectedDate),
      };

      await updateExpense(userUid, expense.id, updateData);

      // 성공 토스트 표시
      toast.success('지출이 성공적으로 수정되었습니다!');

      // 성공 시 지출 목록으로 이동
      const nextTab =
        formData.type === EXPENSE_TYPES.NONE
          ? 'unclassified'
          : 'classified';
      navigate(`/expenses?tab=${nextTab}`);
    } catch (error) {
      console.error('updateExpense error:', error);
      toast.error('지출 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!expense) return;

    try {
      await deleteExpense(userUid, expense.id);
      
      // 성공 토스트 표시
      toast.success('지출이 성공적으로 삭제되었습니다!');
      
      navigate('/expenses');
    } catch (e) {
      console.error('deleteExpense error:', e);
      toast.error('지출 삭제에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    const nextTab =
      expense?.type === EXPENSE_TYPES.NONE ? 'unclassified' : 'classified';
    navigate(`/expenses?tab=${nextTab}`);
  };

  // Transaction을 ExpenseFormData로 변환 (메모이제이션)
  const getDefaultValues = useMemo((): Partial<ExpenseFormData> => {
    if (!expense) return {};
    
    return {
      price: expense.price,
      title: expense.title,
      userUid: expense.userUid,
      selectedDate: new Date(expense.startedAt),
      type: expense.type,
      category: expense.category,
      dutchPayCount: 1, // 기본값
      app: '', // 기본값 (Transaction에 app 필드가 없으므로)
    };
  }, [expense]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white min-h-screen max-w-md mx-2 relative"
      >
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white min-h-screen max-w-md mx-2 relative"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg border border-red-200 p-6 max-w-md">
            <div className="text-red-600 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => navigate('/expenses')}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!expense) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white min-h-screen max-w-md mx-2 relative pb-20"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">💸</div>
            <p>지출 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </motion.div>
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
      <div className="flex items-center justify-between px-4 py-6">
        <div
          onClick={handleCancel}
          className="cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </div>
        <h1 className="text-[15px] font-medium text-black tracking-[-0.165px]">
          지출 수정
        </h1>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Form */}
      <div className="flex-1">
        <ExpenseForm
          onSubmit={handleFormSubmit}
          onValidationChange={setIsFormValid}
          defaultValues={getDefaultValues}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 py-4 mt-auto mb-16">
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="flex-1 h-[45px] bg-[#EDEDED] text-[#6E6E6E] text-[15px] font-medium rounded-[10px]"
              >
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>지출 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  지출을 삭제 하시겠어요?<br  />삭제 시 다시 복구가 불가능해요
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-3">
                <AlertDialogCancel className="flex-1 h-[45px] text-[15px] font-medium rounded-[10px]">
                  취소
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="flex-1 h-[45px] bg-red-600 hover:bg-red-700 text-white text-[15px] font-medium rounded-[10px]"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            form="expense-form"
            type="submit"
            disabled={isUpdating || !isFormValid}
            className={`flex-1 h-[45px] text-white text-[15px] font-medium rounded-[10px] hover:bg-[#002b5b]/90 disabled:opacity-50 transition-colors ${
              isFormValid && !isUpdating
                ? 'bg-[#002b5b]'
                : 'bg-[#EDEDED] text-gray-400 cursor-not-allowed hover:bg-[#EDEDED]'
            }`}
          >
            {isUpdating ? '수정 중...' : '수정'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
