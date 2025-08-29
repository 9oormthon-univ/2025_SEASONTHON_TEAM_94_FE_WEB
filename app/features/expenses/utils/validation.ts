import { z } from 'zod';
import { EXPENSE_TYPES, EXPENSE_CATEGORIES } from '@/shared/types/expense';

// API 문서의 TransactionCreateRequest에 맞는 스키마
export const transactionCreateSchema = z.object({
  price: z
    .number({ message: '올바른 금액을 입력해주세요.' })
    .min(0, '금액은 0 이상이어야 합니다.')
    .int('금액은 정수여야 합니다.'),
  
  title: z
    .string({ message: '제목을 입력해주세요.' })
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이하로 입력해주세요.'),
  
  userUid: z
    .string({ message: '사용자 정보가 필요합니다.' })
    .min(1, '사용자 정보가 필요합니다.'),
  
  startAt: z
    .string()
    .datetime('올바른 날짜 형식이 아닙니다.')
    .optional(),
  
  type: z
    .enum([EXPENSE_TYPES.OVER_EXPENSE, EXPENSE_TYPES.FIXED_EXPENSE, EXPENSE_TYPES.NONE] as const)
    .default(EXPENSE_TYPES.OVER_EXPENSE),
  
  category: z
    .enum([
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
    ] as const)
    .optional(),
});

// 폼에서 사용할 스키마 (UI 전용 필드 포함)
export const expenseFormSchema = z.object({
  // API 필드들
  price: z
    .number({ message: '올바른 금액을 입력해주세요.' })
    .min(1, '금액은 0 이상이어야 합니다.')
    .int('금액은 정수여야 합니다.'),
  
  title: z
    .string({ message: '제목을 입력해주세요.' })
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이하로 입력해주세요.'),
  
  userUid: z
    .string({ message: '사용자 정보가 필요합니다.' })
    .min(1, '사용자 정보가 필요합니다.'),
  
  startAt: z
    .string()
    .datetime('올바른 날짜 형식이 아닙니다.')
    .optional(),
  
  type: z
    .enum([EXPENSE_TYPES.OVER_EXPENSE, EXPENSE_TYPES.FIXED_EXPENSE, EXPENSE_TYPES.NONE] as const),
  
  category: z
    .enum([
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
    ] as const)
    .optional(),
  
  // UI 전용 필드들
  selectedDate: z.date({ message: '날짜를 선택해주세요.' }),
  
  dutchPayCount: z
    .number({ message: '더치페이 인원을 입력해주세요.' })
    .min(0, '더치페이 인원은 1명 이상이어야 합니다.')
    .max(20, '더치페이 인원은 20명 이하로 설정해주세요.')
    .int('더치페이 인원은 정수여야 합니다.'),
  
  app: z.string(),
});

// 타입 추출
export type TransactionCreateData = z.infer<typeof transactionCreateSchema>;
export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
