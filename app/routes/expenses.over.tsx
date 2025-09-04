import { Link } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useExpensesByType } from '@/features/expenses/hooks';
import { Header } from '@/shared/components/Header';
import { CategorizedExpenseList } from '@/features/expenses/components/List/CategorizedExpenseList';
import ArrowDownIcon from '@/assets/keyboard_arrow_down.svg?react';
import PlusIcon from '@/assets/plus.svg?react';

export default function OverExpensesPage() {
  const [selectedMonth, setSelectedMonth] = useState('8월 1일 - 8월 28일');

  // 초과 지출 데이터 가져오기
  const overExpensesQuery = useExpensesByType('OVER_EXPENSE');
  const expenses = overExpensesQuery.data || [];
  const loading = overExpensesQuery.isLoading;
  const error = overExpensesQuery.error;

  // 트랜잭션 업데이트 핸들러
  const handleTransactionUpdate = () => {
    overExpensesQuery.refetch();
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.'}
          </p>
          <button
            onClick={() => overExpensesQuery.refetch()}
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

      {/* Page Title with Plus Button */}
      <div className="bg-white h-[60px]">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="py-2 text-2xl font-bold text-sub-blue">
              초과 지출
            </h1>
          </div>

          {/* Plus Button */}
          <Link 
            to="/expenses/add"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <PlusIcon className="w-9 h-9" />
          </Link>
        </div>
      </div>

      {/* Date Filter */}
      <div className="text-sm text-sub-gray px-6 pt-4 pb-2 flex items-center">
        {selectedMonth}
        <ArrowDownIcon className="w-3 h-3 ml-2" />
      </div>

      <div className="px-6 pt-2">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-main-orange"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            <CategorizedExpenseList
              expenses={expenses}
              onExpenseUpdate={handleTransactionUpdate}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
