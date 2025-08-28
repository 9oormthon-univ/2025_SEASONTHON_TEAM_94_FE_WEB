/**
 * 네이티브 안드로이드와 통신하는 함수를 정의합니다.
 * window.Android 객체가 없는 개발 환경에서는 Mock 데이터를 반환합니다.
 */

// Mock 데이터용 카테고리 상수
const EXPENSE_CATEGORIES = {
  UNCLASSIFIED: 'unclassified',
  FIXED: 'fixed',
  ADDITIONAL: 'additional',
};

export function fetchAllExpenses() {
  // SSR 환경에서 window 객체 확인
  if (typeof window !== 'undefined' && window.Android && window.Android.getAllExpenses) {
    try {
      const expensesJson = window.Android.getAllExpenses();
      return JSON.parse(expensesJson || '[]');
    } catch (e) {
      console.error("Failed to parse expenses from native", e);
      return [];
    }
  }
  // --- 개발용 Mock 데이터 ---
  if (typeof window !== 'undefined' && process?.env?.NODE_ENV === 'development') {
    console.warn("Native bridge not found or SSR environment. Using mock data.");
  }
  return [
    { id: '1', place: '스타벅스', amount: 6500, date: '2025-08-25T10:30:00Z', category: EXPENSE_CATEGORIES.UNCLASSIFIED, sharedWith: 1 },
    { id: '2', place: 'Netflix', amount: 17000, date: '2025-08-25T09:00:00Z', category: EXPENSE_CATEGORIES.FIXED, sharedWith: 1 },
    { id: '3', place: 'GS25', amount: 3200, date: '2025-08-24T18:00:00Z', category: EXPENSE_CATEGORIES.ADDITIONAL, sharedWith: 2 },
  ];
}

export function updateExpense(expense) {
  // SSR 환경에서 window 객체 확인
  if (typeof window !== 'undefined' && window.Android && window.Android.updateExpense) {
    window.Android.updateExpense(JSON.stringify(expense));
  } else if (typeof window !== 'undefined' && process?.env?.NODE_ENV === 'development') {
    console.log("Mock update expense:", expense);
  }
}
