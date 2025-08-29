// API 스펙에 맞는 타입 정의
export const EXPENSE_TYPES = {
  OVER_EXPENSE: 'OVER_EXPENSE',
  FIXED_EXPENSE: 'FIXED_EXPENSE',
  NONE: 'NONE',
} as const;

export type ExpenseType = (typeof EXPENSE_TYPES)[keyof typeof EXPENSE_TYPES];

export const EXPENSE_CATEGORIES = {
  FOOD: 'FOOD',
  GROCERIES: 'GROCERIES',
  TRANSPORT: 'TRANSPORT',
  CAR: 'CAR',
  HOUSING: 'HOUSING',
  UTILITIES: 'UTILITIES',
  TELECOM: 'TELECOM',
  SUBSCRIPTIONS: 'SUBSCRIPTIONS',
  SHOPPING: 'SHOPPING',
  BEAUTY: 'BEAUTY',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  ENTERTAINMENT: 'ENTERTAINMENT',
  TRAVEL: 'TRAVEL',
  PETS: 'PETS',
  GIFTS_OCCASIONS: 'GIFTS_OCCASIONS',
  INSURANCE: 'INSURANCE',
  TAXES_FEES: 'TAXES_FEES',
  DONATION: 'DONATION',
  OTHER: 'OTHER',
} as const;

export type ExpenseCategory =
  (typeof EXPENSE_CATEGORIES)[keyof typeof EXPENSE_CATEGORIES];

// 실제 API 응답 구조에 맞는 Transaction 타입 (Swagger 스펙 기준)
export interface Transaction {
  id: number;
  price: number;
  title: string;
  type: ExpenseType;
  userUid: string;
  category: ExpenseCategory;
  createdAt: string;
  updatedAt: string;
  startedAt: string; // startAt -> startedAt로 변경
}

// 카테고리 응답 타입
export interface TransactionCategoryResponse {
  value: string;
  label: string;
}

// 생성 요청 타입 (Swagger 스펙 기준)
export interface TransactionCreateRequest {
  price: number;
  startAt?: string; // optional
  title: string;
  userUid: string; // userId -> userUid로 변경
  type?: ExpenseType; // 지출 유형 추가
  category?: ExpenseCategory; // 카테고리 추가
}

// 수정 요청 타입 (Swagger 스펙 기준)
export interface TransactionUpdateRequest {
  price: number;
  type?: ExpenseType;
  startAt?: string;
  title: string;
  category?: ExpenseCategory;
}

// Report 응답 타입 (Swagger 스펙 기준)
export interface TransactionReportResponse {
  totalPrice: number;
  totalCount: number;
  startAt: string;
  endAt: string;
}

// 조회 필터 타입
export interface TransactionFilter {
  userUid: string;
  type: ExpenseType;
  startAt?: string;
  endAt?: string;
}

// 기존 호환성을 위한 별칭
export type Expense = Transaction;
export type ExpenseCategory_Legacy = 'unclassified' | 'fixed' | 'additional';
