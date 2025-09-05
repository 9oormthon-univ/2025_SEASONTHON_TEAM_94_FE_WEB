import type { ExpenseFormData } from '@/features/expenses/_lib/validation';
import type {
  TransactionCreateRequest,
  Transaction,
} from '@/shared/types/expense';

/**
 * 폼 데이터를 API 요청 데이터로 변환합니다
 */
export function convertFormDataToApiRequest(
  formData: ExpenseFormData
): TransactionCreateRequest {
  return {
    price: formData.price,
    title: formData.title,
    bankName: formData.bankName || '',
    splitCount: formData.dutchPayCount, // dutchPayCount를 splitCount로 매핑
    type: formData.type,
    category: formData.category,
    startAt: formData.selectedDate.toISOString(),
    // memo는 TransactionCreateRequest에 없으므로 제외
  };
}

/**
 * 지출 목록을 날짜별로 그룹화합니다
 * @param expenses 지출 목록
 * @returns 날짜별로 그룹화된 지출 목록 (최신 날짜가 위로)
 */
export function groupExpensesByDate(expenses: Transaction[]) {
  const groups: { [key: string]: Transaction[] } = {};

  expenses.forEach(expense => {
    const dateKey = expense.startedAt.split('T')[0]; // YYYY-MM-DD 형식
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(expense);
  });

  // 날짜 순으로 정렬 (최신 날짜가 위로)
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, expenses]) => ({
      date,
      expenses: expenses.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      ),
    }));
}
