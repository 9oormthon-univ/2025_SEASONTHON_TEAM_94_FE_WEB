import { Link } from 'react-router';
import type { Transaction } from '@/shared/types/expense';
import { formatExpenseDate } from '../utils/expenseUtils';

interface UncategorizedExpenseListProps {
  expenses: Transaction[];
  emptyState?: {
    icon: string;
    title: string;
    description: string;
  };
}

export function UncategorizedExpenseList({
  expenses,
  emptyState,
}: UncategorizedExpenseListProps) {
  if (expenses.length === 0 && emptyState) {
    return (
      <div className="py-12 text-center">
        <div className="text-4xl mb-4">{emptyState.icon}</div>
        <h3 className="text-lg font-semibold mb-2">{emptyState.title}</h3>
        <p className="text-gray-500 text-sm">{emptyState.description}</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-gray-500 text-base">미분류 항목이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      {expenses.map(expense => (
        <UncategorizedExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}

interface UncategorizedExpenseItemProps {
  expense: Transaction;
}

function UncategorizedExpenseItem({ expense }: UncategorizedExpenseItemProps) {
  // 은행명 추출 (title에서 첫 번째 단어 또는 기본값)
  const bankName = expense.title.split(' ')[0] || '은행';

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Main Card */}
      <div className="bg-white rounded-[10px] p-4 mb-1.5 flex flex-col">
        <div className="text-[12px] text-[#101010] mb-1 font-medium">
          {formatExpenseDate(expense.startedAt)}
        </div>
        <div className="text-base text-[#101010] mb-3 font-medium">
          <span className="text-black">{bankName}</span>
          <span className="text-[#bfbfbf] ml-1">에서 온 알림</span>
        </div>
        <div className={`text-2xl font-medium 'text-black'}`}>
          - {expense.price.toLocaleString()}원
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-1.5">
        <Link
          to={`/expenses/${expense.id}?action=fixed`}
          className="flex-1 h-[45px] bg-white border border-[#ff6200] rounded-[10px] flex items-center justify-center"
        >
          <span className="text-[16px] font-bold text-[#ff6200]">고정지출</span>
        </Link>
        <Link
          to={`/expenses/${expense.id}?action=over`}
          className="flex-1 h-[45px] bg-[#ff6200] rounded-[10px] flex items-center justify-center"
        >
          <span className="text-[16px] font-bold text-[#fffefb]">초과지출</span>
        </Link>
      </div>
    </div>
  );
}
