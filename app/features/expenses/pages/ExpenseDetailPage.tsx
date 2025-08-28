import { useNavigate, useParams } from 'react-router';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseDetail } from '../components/ExpenseDetail';
import { EXPENSE_TYPES, type Transaction } from '@/shared/types/expense';
import { MOCK_USER_UID } from '@/shared/config/api';
import { useState, useEffect } from 'react';
import { fetchTransactionById } from '../api/expenseApi';

export function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const { updateExpense, deleteExpense } = useExpenses();
  const [expense, setExpense] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = async (updatedExpense: Transaction) => {
    try {
      await updateExpense(userUid, updatedExpense.id, {
        title: updatedExpense.title,
        price: updatedExpense.price,
        type: updatedExpense.type,
        category: updatedExpense.category,
        startAt: updatedExpense.startedAt,
      });

      const nextTab =
        updatedExpense.type === EXPENSE_TYPES.NONE
          ? 'unclassified'
          : 'classified';
      navigate(`/expenses?tab=${nextTab}`);
    } catch (e) {
      console.error('updateExpense error:', e);
      alert('지출 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!expense) return;

    if (confirm('정말로 이 지출을 삭제하시겠습니까?')) {
      try {
        await deleteExpense(userUid, expense.id);
        navigate('/expenses');
      } catch (e) {
        console.error('deleteExpense error:', e);
        alert('지출 삭제에 실패했습니다.');
      }
    }
  };

  const handleCancel = () => {
    const nextTab =
      expense?.type === EXPENSE_TYPES.NONE ? 'unclassified' : 'classified';
    navigate(`/expenses?tab=${nextTab}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <ExpenseDetail
      expense={expense}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    />
  );
}
