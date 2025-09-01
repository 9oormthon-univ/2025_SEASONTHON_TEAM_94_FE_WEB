import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import type { Transaction } from '@/shared/types/expense';
import { formatExpenseDate } from '@/features/expenses/utils/expenseUtils';
import { EXPENSE_TYPES } from '@/shared/types/expense';

interface CategorizedExpenseListProps {
  expenses: Transaction[];
  emptyState?: {
    icon: string;
    title: string;
    description: string;
  };
  onExpenseUpdate?: () => void;
}

export function CategorizedExpenseList({
  expenses,
  emptyState,
  onExpenseUpdate,
}: CategorizedExpenseListProps) {
  const [isOverExpenseExpanded, setIsOverExpenseExpanded] = useState(false);
  const [isFixedExpenseExpanded, setIsFixedExpenseExpanded] = useState(false);
  const navigate = useNavigate();

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
        <div className="text-4xl mb-4">📊</div>
        <p className="text-gray-500 text-base">분류된 항목이 없습니다.</p>
      </div>
    );
  }

  // 타입별로 그룹화
  const overExpenses = expenses.filter(
    expense => expense.type === EXPENSE_TYPES.OVER_EXPENSE
  );
  const fixedExpenses = expenses.filter(
    expense => expense.type === EXPENSE_TYPES.FIXED_EXPENSE
  );

  // 총 금액 계산
  const overTotal = overExpenses.reduce(
    (sum, expense) => sum + expense.price,
    0
  );
  const fixedTotal = fixedExpenses.reduce(
    (sum, expense) => sum + expense.price,
    0
  );

  // 표시할 지출 항목 결정 (5개 제한)
  const ITEMS_PER_PAGE = 3;

  return (
    <div className="pb-32">
      {/* 초과지출 섹션 */}
      {overExpenses.length > 0 && (
        <div className="mb-8">
          <ExpenseSectionHeader
            title="초과지출"
            subtitle="이제 차근차근 줄여보세요!"
            total={overTotal}
            count={overExpenses.length}
          />
          <div className="space-y-3 mt-6">
            {/* 처음 5개 항목은 항상 표시 */}
            {overExpenses.slice(0, ITEMS_PER_PAGE).map(expense => (
              <CategorizedExpenseItem
                key={expense.id}
                expense={expense}
                onUpdate={onExpenseUpdate}
                onClick={() => navigate(`/expenses/${expense.id}`)}
              />
            ))}

            {/* 추가 항목들은 애니메이션과 함께 표시 */}
            <AnimatePresence>
              {isOverExpenseExpanded &&
                overExpenses.slice(ITEMS_PER_PAGE).map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05, // 각 아이템마다 약간의 딜레이로 순차적 애니메이션
                      ease: 'easeOut',
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div>
                      <CategorizedExpenseItem
                        expense={expense}
                        onUpdate={onExpenseUpdate}
                        onClick={() => navigate(`/expenses/${expense.id}`)}
                      />
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          {overExpenses.length > ITEMS_PER_PAGE && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={() => setIsOverExpenseExpanded(!isOverExpenseExpanded)}
                className="text-[#8e8e8e] text-[13px] tracking-[-0.26px] hover:text-[#6b6b6b] transition-colors p-0 h-auto"
              >
                {isOverExpenseExpanded ? '접기' : `더보기`}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 고정지출 섹션 */}
      {fixedExpenses.length > 0 && (
        <div>
          <ExpenseSectionHeader
            title="고정지출"
            total={fixedTotal}
            count={fixedExpenses.length}
          />
          <div className="space-y-6 mt-6">
            {/* 처음 5개 항목은 항상 표시 */}
            {fixedExpenses.slice(0, ITEMS_PER_PAGE).map(expense => (
              <CategorizedExpenseItem
                key={expense.id}
                expense={expense}
                onUpdate={onExpenseUpdate}
                onClick={() => navigate(`/expenses/${expense.id}`)}
              />
            ))}

            {/* 추가 항목들은 애니메이션과 함께 표시 */}
            <AnimatePresence>
              {isFixedExpenseExpanded &&
                fixedExpenses.slice(ITEMS_PER_PAGE).map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05, // 각 아이템마다 약간의 딜레이로 순차적 애니메이션
                      ease: 'easeOut',
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div>
                      <CategorizedExpenseItem
                        expense={expense}
                        onUpdate={onExpenseUpdate}
                        onClick={() => navigate(`/expenses/${expense.id}`)}
                      />
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          {fixedExpenses.length > ITEMS_PER_PAGE && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={() => setIsFixedExpenseExpanded(!isFixedExpenseExpanded)}
                className="text-[#8e8e8e] text-[13px] tracking-[-0.26px] hover:text-[#6b6b6b] transition-colors p-0 h-auto"
              >
                {isFixedExpenseExpanded ? '접기' : `더보기`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 섹션 헤더 컴포넌트
interface ExpenseSectionHeaderProps {
  title: string;
  subtitle?: string;
  total: number;
  count: number;
}

function ExpenseSectionHeader({
  title,
  subtitle,
  total,
  count,
}: ExpenseSectionHeaderProps) {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="text-[24px] font-bold text-[#002b5b]">{title}</div>
        {subtitle && (
          <div className="text-[15px] text-[#1e1e1e]">{subtitle}</div>
        )}
        <div className="text-[24px] font-bold text-[#ff6200]">
          - {total.toLocaleString()}원
        </div>
      </div>

      <div className="flex items-center text-[13px] text-[#8e8e8e] tracking-[-0.26px] my-2">
        <span>8월 1일 - 8월 28일</span>
        <span className="mx-2">·</span>
        <span>{count}회 지출</span>
        {/* 추가 항목 버튼 | 그냥 최상단에서 처리하는게 낫지 않나? */}
        {/* <svg className="w-3 h-3 ml-2" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8.5L2.5 5 3.5 4L6 6.5L8.5 4L9.5 5L6 8.5Z" />
        </svg> */}
      </div>
    </div>
  );
}

interface CategorizedExpenseItemProps {
  expense: Transaction;
  onUpdate?: () => void;
  onClick?: () => void;
}

function CategorizedExpenseItem({
  expense,
  onUpdate,
  onClick,
}: CategorizedExpenseItemProps) {
  const bankName = (expense.title ?? '').trim() || '은행';

  return (
    <div className="flex flex-col gap-1">
      {/* Main Card */}
      <div 
        className="bg-white rounded-[10px] p-4 flex flex-col cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <div className="text-[12px] text-[#101010] mb-1 font-medium">
          {formatExpenseDate(expense.startedAt)}
        </div>
        <div className="text-base text-[#101010] mb-3 font-medium">
          <span className="text-black">{bankName}</span>
          <span className="text-[#bfbfbf] ml-1">에서 온 알림</span>
        </div>
  <div className="text-2xl font-medium text-black">
          - {expense.price.toLocaleString()}원
        </div>
      </div>
    </div>
  );
}
