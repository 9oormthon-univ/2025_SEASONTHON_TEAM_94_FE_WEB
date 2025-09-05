/**
 * 지출 관련 엄격한 타입 정의
 */

import type { ExpenseType, ExpenseCategory } from '@/shared/types/expense';

// 폼 데이터 타입
export interface ExpenseFormData {
  price: number;
  title: string;
  bankName: string;
  memo?: string;
  category?: ExpenseCategory;
  type: ExpenseType;
  dutchPayCount: number;
  splitCount: number;
  selectedDate: Date;
}

// 폼 에러 타입
export interface ExpenseFormErrors {
  price?: string;
  title?: string;
  bankName?: string;
  memo?: string;
  category?: string;
  type?: string;
  dutchPayCount?: string;
  splitCount?: string;
  selectedDate?: string;
}

// 폼 상태 타입
export interface ExpenseFormState {
  data: ExpenseFormData;
  errors: ExpenseFormErrors;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// 일괄 선택 관련 타입
export interface BulkSelectionState<T extends { id: number }> {
  selectedIds: Set<number>;
  hasSelection: boolean;
  selectedItems: T[];
}

// 날짜 범위 타입
export interface DateRange {
  startAt: string;
  endAt: string;
}

// 월 선택기 옵션 타입
export interface MonthOption {
  label: string;
  value: string;
}

// 월 선택기 상태 타입
export interface MonthPickerState {
  isOpen: boolean;
  tempMonthValue: string;
  monthOptions: MonthOption[];
}

// 지출 통계 타입
export interface ExpenseStats {
  totalAmount: number;
  averageAmount: number;
  itemCount: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
}

// 지출 필터 타입
export interface ExpenseFilter {
  type: ExpenseType;
  category?: ExpenseCategory;
  startAt?: string;
  endAt?: string;
  minAmount?: number;
  maxAmount?: number;
}

// 지출 정렬 옵션 타입
export type ExpenseSortOption = 
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc'
  | 'title-asc'
  | 'title-desc';

// 지출 정렬 설정 타입
export interface ExpenseSortConfig {
  field: 'date' | 'amount' | 'title';
  direction: 'asc' | 'desc';
}

// API 응답 상태 타입
export type ApiResponseStatus = 'idle' | 'loading' | 'success' | 'error';

// 쿼리 상태 타입
export interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  isFetching: boolean;
  isRefetching: boolean;
}

// 뮤테이션 상태 타입
export interface MutationState<TData, TVariables> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  isIdle: boolean;
  variables: TVariables | undefined;
  reset: () => void;
}

// 지출 액션 타입
export type ExpenseAction = 
  | { type: 'CREATE'; payload: ExpenseFormData }
  | { type: 'UPDATE'; id: number; payload: Partial<ExpenseFormData> }
  | { type: 'DELETE'; id: number }
  | { type: 'BULK_UPDATE'; ids: number[]; payload: Partial<ExpenseFormData> }
  | { type: 'BULK_DELETE'; ids: number[] };

// 지출 상태 타입
export interface ExpenseState {
  items: Record<number, ExpenseFormData>;
  selectedIds: Set<number>;
  filter: ExpenseFilter;
  sort: ExpenseSortConfig;
  isLoading: boolean;
  error: string | null;
}

// 유틸리티 타입들
export type NonEmptyArray<T> = [T, ...T[]];

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 지출 검증 결과 타입
export interface ValidationResult {
  isValid: boolean;
  errors: ExpenseFormErrors;
}

// 지출 검증 규칙 타입
export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

// 지출 검증 스키마 타입
export interface ValidationSchema<T> {
  [K in keyof T]?: ValidationRule<T[K]>[];
}

// 지출 이벤트 타입
export interface ExpenseEvent {
  type: 'created' | 'updated' | 'deleted' | 'bulk_updated' | 'bulk_deleted';
  timestamp: Date;
  data: any;
  userId?: string;
}

// 지출 히스토리 타입
export interface ExpenseHistory {
  id: string;
  expenseId: number;
  action: ExpenseEvent['type'];
  changes: Record<string, { from: any; to: any }>;
  timestamp: Date;
  userId?: string;
}

// 지출 백업 타입
export interface ExpenseBackup {
  id: string;
  timestamp: Date;
  data: ExpenseFormData[];
  metadata: {
    version: string;
    totalItems: number;
    totalAmount: number;
  };
}
