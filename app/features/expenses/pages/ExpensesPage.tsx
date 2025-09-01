import { useSearchParams, Link } from 'react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUncategorizedExpenses, useCategorizedExpenses } from '@/features/expenses/hooks';
import { Header } from '@/shared/components/Header';
import { UncategorizedExpenseList } from '@/features/expenses/components/List/UncategorizedExpenseList';
import { CategorizedExpenseList } from '@/features/expenses/components/List/CategorizedExpenseList';
import { MOCK_USER_UID } from '@/shared/config/api';
import ArrowDownIcon from '@/assets/keyboard_arrow_down.svg?react';
import PlusIcon from '@/assets/plus.svg?react';

export function ExpensesPage() {
  const [searchParams] = useSearchParams();
  const activeTab =
    (searchParams.get('tab') as 'unclassified' | 'classified') ||
    'unclassified';
  const [selectedMonth, setSelectedMonth] = useState('8월 1일 - 8월 28일');

  // TanStack Query 훅을 사용하여 데이터 가져오기
  const uncategorizedQuery = useUncategorizedExpenses(MOCK_USER_UID);
  const categorizedQuery = useCategorizedExpenses(MOCK_USER_UID);

  // 현재 활성 탭에 따라 적절한 쿼리 선택
  const currentQuery = activeTab === 'unclassified' ? uncategorizedQuery : categorizedQuery;
  const expenses = currentQuery.data || [];
  const loading = currentQuery.isLoading;
  const error = currentQuery.error;

  // 트랜잭션 업데이트 핸들러 (삭제 등의 경우)
  const handleTransactionUpdateWithParams = (id: number) => {
    // TanStack Query는 mutation 후 자동으로 캐시를 업데이트하므로
    // 별도의 상태 업데이트가 필요 없음
    currentQuery.refetch();
  };

  // 트랜잭션 일반 업데이트 핸들러
  const handleTransactionUpdate = () => {
    currentQuery.refetch();
  };

  const renderContent = () => {
    if (activeTab === 'unclassified') {
      return (
        <UncategorizedExpenseList
          expenses={expenses}
          onTransactionUpdate={handleTransactionUpdateWithParams}
        />
      );
    } else {
      return (
        <CategorizedExpenseList
          expenses={expenses}
          onExpenseUpdate={handleTransactionUpdate}
        />
      );
    }
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.'}
          </p>
          <button
            onClick={() => currentQuery.refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto">
      <Header />

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
          <Link 
            to="/expenses/add"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
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
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#ff6200]"></div>
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
