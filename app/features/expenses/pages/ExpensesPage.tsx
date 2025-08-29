import { useSearchParams, Link } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTransactions } from '@/features/expenses/api/expenseApi';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import { UncategorizedExpenseList } from '@/features/expenses/components/UncategorizedExpenseList';
import { CategorizedExpenseList } from '@/features/expenses/components/CategorizedExpenseList';
import { EXPENSE_TYPES, type Transaction } from '@/shared/types/expense';
import { MOCK_USER_UID } from '@/shared/config/api';
import ArrowDownIcon from '@/assets/keyboard_arrow_down.svg?react';
import PlusIcon from '@/assets/plus.svg?react';

export function ExpensesPage() {
  const [searchParams] = useSearchParams();
  const activeTab =
    (searchParams.get('tab') as 'unclassified' | 'classified') ||
    'unclassified';
  const [selectedMonth, setSelectedMonth] = useState('8월 1일 - 8월 28일');

  // 탭별 독립적인 상태 관리
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 탭별 API 호출
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Transaction[] = [];

      if (activeTab === 'unclassified') {
        // 미분류 탭: NONE 타입만
        data = await fetchTransactions({
          userUid: MOCK_USER_UID,
          type: EXPENSE_TYPES.NONE,
        });
      } else {
        // 분류 탭: OVER_EXPENSE와 FIXED_EXPENSE 둘 다 가져오기
        const [overExpenses, fixedExpenses] = await Promise.all([
          fetchTransactions({
            userUid: MOCK_USER_UID,
            type: EXPENSE_TYPES.OVER_EXPENSE,
          }),
          fetchTransactions({
            userUid: MOCK_USER_UID,
            type: EXPENSE_TYPES.FIXED_EXPENSE,
          }),
        ]);
        data = [...overExpenses, ...fixedExpenses];
      }

      setExpenses(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '지출 데이터를 불러오는데 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 탭이 변경될 때마다 새로 로드
  useEffect(() => {
    loadExpenses();
  }, [activeTab]);

  // Transaction 업데이트 후 콜백 함수
  const handleTransactionUpdate = useCallback((expenseId: number) => {
    // 해당 아이템을 로컬 상태에서 제거 (애니메이션 완료 후)
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  }, []);

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-red-200 p-6 max-w-md">
          <div className="text-red-600 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={loadExpenses}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'unclassified') {
      return (
        <UncategorizedExpenseList
          expenses={expenses}
          emptyState={{
            icon: '🎉',
            title: '미분류 지출이 없어요!',
            description: '모든 지출이 분류되었습니다.',
          }}
          onTransactionUpdate={handleTransactionUpdate}
        />
      );
    }

    return (
      <CategorizedExpenseList
        expenses={expenses}
        emptyState={{
          icon: '📝',
          title: '분류된 지출이 없어요',
          description: '지출을 추가하고 분류해보세요.',
        }}
        onExpenseUpdate={loadExpenses}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto">
      <ExpenseHeader />

      {/* Tabs with Plus Button */}
      <div className="bg-white h-[60px]">
        <div className="flex items-center justify-between px-6">
          <div className="flex">
            <div className="relative">
              <Link
                to="/expenses?tab=unclassified"
                className={`py-2 text-2xl font-bold transition-colors duration-200 ${
                  activeTab === 'unclassified'
                    ? 'text-[#002b5b]'
                    : 'text-[#bfbfbf]'
                }`}
              >
                미분류
              </Link>
              {activeTab === 'unclassified' && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#002b5b]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </div>
            <div className="relative ml-6">
              <Link
                to="/expenses?tab=classified"
                className={`py-2 text-2xl font-bold transition-colors duration-200 ${
                  activeTab === 'classified'
                    ? 'text-[#002b5b]'
                    : 'text-[#bfbfbf]'
                }`}
              >
                분류
              </Link>
              {activeTab === 'classified' && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#002b5b]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </div>
          </div>

          {/* Plus Button - 탭과 같은 라인 */}
          <Link to="/expenses/add">
            <PlusIcon className="w-9 h-9" />
          </Link>
        </div>
      </div>

      {/* Date Filter */}
      <div className="text-sm text-[#757575] px-6 pt-4 pb-2 flex items-center">
        {selectedMonth}
        <ArrowDownIcon className="w-3 h-3 ml-2" />
      </div>

      <div className="px-6 pt-2">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6200]"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
