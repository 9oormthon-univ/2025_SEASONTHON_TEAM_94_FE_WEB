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

// API 응답 구조에 맞는 TransactionResponse 타입 (Swagger 스펙 기준)
export interface TransactionResponse {
  id: number; // int64
  price: number; // int64
  title: string;
  bankName: string;
  memo?: string;
  splitCount: number; // int32
  type: ExpenseType;
  userUid: string;
  category?: ExpenseCategory;
  createdAt: string; // date-time format
  updatedAt: string; // date-time format
  startedAt: string; // date-time format (API 응답에서 startedAt로 옴)
}

// 기존 호환성을 위한 별칭
export interface Transaction extends TransactionResponse {}

// 카테고리 응답 타입
export interface TransactionCategoryResponse {
  value: string;
  label: string;
}

// 생성 요청 타입 (Swagger 스펙 기준)
export interface TransactionCreateRequest {
  price: number; // minimum: 0, int64 format
  startAt?: string; // date-time format, optional
  title: string; // required
  bankName: string; // required
  splitCount: number; // int32, required
  type?: ExpenseType; // optional - OVER_EXPENSE, FIXED_EXPENSE, NONE
  category?: ExpenseCategory; // optional - 카테고리 enum
  memo?: string; // optional - 메모 필드 추가
}

// 수정 요청 타입 (Swagger 스펙 기준)
export interface TransactionUpdateRequest {
  price: number; // minimum: 0, int64 format, required
  type?: ExpenseType; // optional
  startAt?: string; // date-time format, optional
  title: string; // required
  bankName: string; // required
  splitCount: number; // int32, required
  memo?: string; // optional
  category?: ExpenseCategory; // optional
}

// 알림으로 생성 요청 타입 (Swagger 스펙 기준)
export interface TransactionCreateByAlertRequest {
  price: number; // int64 format, required
  startAt?: string; // date-time format, optional
  title: string; // required
  bankName: string; // required
  memo?: string; // optional
  userUid: string; // required
}

// Report 응답 타입 (Swagger 스펙 기준)
export interface TransactionReportResponse {
  totalPrice: number; // int64
  totalCount: number; // int64
  startAt: string; // date-time format
  endAt: string; // date-time format
}

// 조회 필터 타입 (GET /api/v1/transactions 파라미터)
export interface TransactionFilter extends Record<string, string | number | boolean | undefined> {
  type: ExpenseType; // required - OVER_EXPENSE, FIXED_EXPENSE, NONE
  startAt?: string; // date format, optional
  endAt?: string; // date format, optional
}

// 기존 호환성을 위한 별칭
export type Expense = Transaction;
