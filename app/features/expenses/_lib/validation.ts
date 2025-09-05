import { z } from 'zod';
import { EXPENSE_TYPES, EXPENSE_CATEGORIES } from '@/shared/types/expense';

// Hook 관련 타입들
export type {
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionFilter,
  ExpenseType,
  ExpenseCategory,
} from '@/shared/types/expense';

// 공통 필드 스키마
const baseTransactionSchema = z.object({
  price: z
    .number({ message: '올바른 금액을 입력해주세요.' })
    .min(1, '금액은 0 이상이어야 합니다.')
    .int('금액은 정수여야 합니다.'),

  title: z
    .string({ message: '제목을 입력해주세요.' })
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이하로 입력해주세요.'),
});

// 카테고리 enum 스키마
const categorySchema = z.enum([
  EXPENSE_CATEGORIES.FOOD,
  EXPENSE_CATEGORIES.GROCERIES,
  EXPENSE_CATEGORIES.TRANSPORT,
  EXPENSE_CATEGORIES.CAR,
  EXPENSE_CATEGORIES.HOUSING,
  EXPENSE_CATEGORIES.UTILITIES,
  EXPENSE_CATEGORIES.TELECOM,
  EXPENSE_CATEGORIES.SUBSCRIPTIONS,
  EXPENSE_CATEGORIES.SHOPPING,
  EXPENSE_CATEGORIES.BEAUTY,
  EXPENSE_CATEGORIES.HEALTHCARE,
  EXPENSE_CATEGORIES.EDUCATION,
  EXPENSE_CATEGORIES.ENTERTAINMENT,
  EXPENSE_CATEGORIES.TRAVEL,
  EXPENSE_CATEGORIES.PETS,
  EXPENSE_CATEGORIES.GIFTS_OCCASIONS,
  EXPENSE_CATEGORIES.INSURANCE,
  EXPENSE_CATEGORIES.TAXES_FEES,
  EXPENSE_CATEGORIES.DONATION,
  EXPENSE_CATEGORIES.OTHER,
] as const);

// 타입 enum 스키마
const typeSchema = z.enum([
  EXPENSE_TYPES.OVER_EXPENSE,
  EXPENSE_TYPES.FIXED_EXPENSE,
  EXPENSE_TYPES.NONE,
] as const);

// API 문서의 TransactionCreateRequest에 맞는 스키마
export const transactionCreateSchema = z.object({
  price: z
    .number({ message: '올바른 금액을 입력해주세요.' })
    .min(0, '금액은 0 이상이어야 합니다.')
    .int('금액은 정수여야 합니다.'),

  title: z
    .string({ message: '제목을 입력해주세요.' })
    .min(1, '제목을 입력해주세요.'),

  bankName: z
    .string({ message: '은행명을 입력해주세요.' })
    .min(1, '은행명을 입력해주세요.'),

  splitCount: z
    .number({ message: '분할 횟수를 입력해주세요.' })
    .min(1, '분할 횟수는 1 이상이어야 합니다.')
    .int('분할 횟수는 정수여야 합니다.'),

  startAt: z.string().datetime('올바른 날짜 형식이 아닙니다.').optional(),

  type: typeSchema.optional(),
  category: categorySchema.optional(),
  memo: z.string().optional(),
});

// 폼에서 사용할 스키마 (UI 전용 필드 포함)
export const expenseFormSchema = z.object({
  // 필수 필드들
  price: z
    .number({ message: '올바른 금액을 입력해주세요.' })
    .min(1, '금액은 1원 이상이어야 합니다.')
    .int('금액은 정수여야 합니다.'),

  title: z
    .string({ message: '거래처를 입력해주세요.' })
    .min(1, '거래처를 입력해주세요.')
    .max(200, '거래처는 200자 이하로 입력해주세요.'),

  splitCount: z
    .number({ message: '더치페이 인원을 입력해주세요.' })
    .min(1, '더치페이 인원은 1명 이상이어야 합니다.')
    .max(20, '더치페이 인원은 20명 이하로 설정해주세요.')
    .int('더치페이 인원은 정수여야 합니다.'),

  selectedDate: z.date({ message: '지출일시를 선택해주세요.' }),

  // 선택 필드들
  bankName: z.string().optional().or(z.literal('')), // 빈 문자열 허용

  memo: z.string().optional(),

  type: typeSchema,
  category: categorySchema.optional(),

  // 더치페이 UI를 위한 별칭 (splitCount와 동일한 값)
  dutchPayCount: z
    .number({ message: '더치페이 인원을 입력해주세요.' })
    .min(1, '더치페이 인원은 1명 이상이어야 합니다.')
    .max(20, '더치페이 인원은 20명 이하로 설정해주세요.')
    .int('더치페이 인원은 정수여야 합니다.'),
});

// API 문서의 TransactionUpdateRequest에 맞는 스키마
export const transactionUpdateSchema = z.object({
  price: z
    .number({ message: '올바른 금액을 입력해주세요.' })
    .min(0, '금액은 0 이상이어야 합니다.')
    .int('금액은 정수여야 합니다.'),

  title: z
    .string({ message: '제목을 입력해주세요.' })
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이하로 입력해주세요.'),

  bankName: z
    .string({ message: '은행명을 입력해주세요.' })
    .min(1, '은행명을 입력해주세요.')
    .max(50, '은행명은 50자 이하로 입력해주세요.'),

  splitCount: z
    .number({ message: '분할 횟수를 입력해주세요.' })
    .min(1, '분할 횟수는 1 이상이어야 합니다.')
    .int('분할 횟수는 정수여야 합니다.'),

  type: typeSchema.optional(),
  startAt: z.string().datetime('올바른 날짜 형식이 아닙니다.').optional(),
  memo: z.string().optional(),
  category: categorySchema.optional(),
});

// 알림으로 지출 생성 요청 스키마 (TransactionCreateByAlertRequest)
export const transactionCreateByAlertSchema = z.object({
  price: z
    .number({ message: '올바른 금액을 입력해주세요.' })
    .int('금액은 정수여야 합니다.'),

  title: z
    .string({ message: '제목을 입력해주세요.' })
    .min(1, '제목을 입력해주세요.'),

  bankName: z
    .string({ message: '은행명을 입력해주세요.' })
    .min(1, '은행명을 입력해주세요.'),

  userUid: z
    .string({ message: '사용자 UID를 입력해주세요.' })
    .min(1, '사용자 UID를 입력해주세요.'),

  startAt: z.string().datetime('올바른 날짜 형식이 아닙니다.').optional(),

  memo: z.string().optional(),
});

// 사용자 업데이트 요청 스키마 (UserUpdateRequest)
export const userUpdateSchema = z.object({
  nickname: z
    .string({ message: '닉네임을 입력해주세요.' })
    .min(1, '닉네임을 입력해주세요.'),
});

// 타입 추출
export type TransactionCreateData = z.infer<typeof transactionCreateSchema>;
export type TransactionCreateByAlertData = z.infer<
  typeof transactionCreateByAlertSchema
>;
export type TransactionUpdateData = z.infer<typeof transactionUpdateSchema>;
export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;

// 검증 결과 타입
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 검증 헬퍼 함수
export function validateExpenseForm(data: ExpenseFormData): ValidationResult {
  try {
    expenseFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: '알 수 없는 오류가 발생했습니다.' } };
  }
}

// 개별 필드 검증 함수
export function validateField<T>(
  value: T,
  schema: z.ZodSchema<T>
): { isValid: boolean; error?: string } {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
}