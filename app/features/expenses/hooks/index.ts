/**
 * 지출 관련 통합 훅 (TanStack Query 기반)
 */

export {
  useExpenses,
  useExpensesByType,
  useExpenseDetail,
  useExpenseReport,
  useExpenseCategories,
  useExpenseTotalByType,
  useUncategorizedExpenses,
  useCategorizedExpenses,
} from './useExpenseQueries';

export {
  useCreateExpense,
  useCreateExpenseByAlert,
  useUpdateExpense,
  useDeleteExpense,
} from './useExpenseMutations';
