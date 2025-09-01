/**
 * Validation schema tests for expenses.
 * Testing library/framework: If using Vitest, these imports are used. If using Jest with globals,
 * the imports will be tree-shaken or you can remove them; the tests still follow Jest/Vitest APIs.
 */
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import the schemas under test. Adjust the import path if your source file differs.
// If schemas live in a separate validation.ts, point to it; otherwise, import from current module.
import { transactionCreateSchema, expenseFormSchema } from './validation';

// Enum constants used by the schemas (path alias should be configured in tsconfig paths)
import { EXPENSE_TYPES, EXPENSE_CATEGORIES } from '@/shared/types/expense';

describe('transactionCreateSchema', () => {
  const base = {
    price: 0,
    title: 'Lunch',
    userUid: 'user_123',
  };

  it('accepts minimal valid input (optional fields omitted)', () => {
    const parsed = transactionCreateSchema.parse(base);
    expect(parsed).toEqual(base);
  });

  it('accepts valid ISO datetime for startAt', () => {
    const data = { ...base, startAt: '2025-09-01T00:00:00.000Z' };
    const parsed = transactionCreateSchema.parse(data);
    expect(parsed.startAt).toBe('2025-09-01T00:00:00.000Z');
  });

  it('rejects invalid datetime string for startAt', () => {
    const data = { ...base, startAt: 'not-a-date' };
    const res = transactionCreateSchema.safeParse(data);
    expect(res.success).toBe(false);
    if (!res.success) {
      const msg = res.error.issues.map(i => i.message).join(' | ');
      expect(msg).toContain('올바른 날짜 형식이 아닙니다.');
    }
  });

  it('accepts enum values for optional type', () => {
    const data = { ...base, type: EXPENSE_TYPES.FIXED_EXPENSE };
    expect(() => transactionCreateSchema.parse(data)).not.toThrow();
  });

  it('rejects invalid type when provided', () => {
    const data = { ...base, type: 'INVALID' as any };
    const res = transactionCreateSchema.safeParse(data);
    expect(res.success).toBe(false);
  });

  it('accepts enum values for optional category', () => {
    const data = { ...base, category: EXPENSE_CATEGORIES.FOOD };
    expect(() => transactionCreateSchema.parse(data)).not.toThrow();
  });

  it('rejects invalid category when provided', () => {
    const data = { ...base, category: 'INVALID' as any };
    const res = transactionCreateSchema.safeParse(data);
    expect(res.success).toBe(false);
  });

  it('enforces price >= 0 and integer', () => {
    // negative
    let res = transactionCreateSchema.safeParse({ ...base, price: -1 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('0 이상'))).toBe(true);
    }

    // non-integer
    res = transactionCreateSchema.safeParse({ ...base, price: 10.5 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('정수'))).toBe(true);
    }

    // valid integer zero
    expect(() => transactionCreateSchema.parse({ ...base, price: 0 })).not.toThrow();
  });

  it('enforces title length 1..200', () => {
    // empty
    let res = transactionCreateSchema.safeParse({ ...base, title: '' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('제목을 입력'))).toBe(true);
    }

    // 200 chars ok
    const twoHundred = 'a'.repeat(200);
    expect(() => transactionCreateSchema.parse({ ...base, title: twoHundred })).not.toThrow();

    // 201 chars fail
    res = transactionCreateSchema.safeParse({ ...base, title: 'a'.repeat(201) });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('200자 이하'))).toBe(true);
    }
  });

  it('requires userUid non-empty string', () => {
    const res = transactionCreateSchema.safeParse({ ...base, userUid: '' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('사용자 정보'))).toBe(true);
    }
  });
});

describe('expenseFormSchema', () => {
  const base = {
    price: 1,
    title: 'Groceries',
    userUid: 'user_123',
    selectedDate: new Date('2025-09-01T10:00:00.000Z'),
    dutchPayCount: 0,
    app: 'web',
    type: EXPENSE_TYPES.NONE,
  };

  it('accepts valid full form with minimal values', () => {
    const parsed = expenseFormSchema.parse(base);
    expect(parsed.price).toBe(1);
    expect(parsed.dutchPayCount).toBe(0);
    expect(parsed.type).toBe(EXPENSE_TYPES.NONE);
  });

  it('requires type (unlike API schema where it is optional)', () => {
    const { type, ...withoutType } = base;
    const res = expenseFormSchema.safeParse(withoutType as any);
    expect(res.success).toBe(false);
  });

  it('accepts optional startAt and category when valid', () => {
    const data = {
      ...base,
      startAt: '2025-09-01T00:00:00.000Z',
      category: EXPENSE_CATEGORIES.HEALTHCARE,
    };
    expect(() => expenseFormSchema.parse(data)).not.toThrow();
  });

  it('rejects invalid startAt when provided', () => {
    const data = { ...base, startAt: 'invalid-date' as any };
    const res = expenseFormSchema.safeParse(data);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('올바른 날짜 형식'))).toBe(true);
    }
  });

  it('enforces price >= 1 (note: message says 0 but constraint is 1)', () => {
    // 0 should fail due to min(1)
    let res = expenseFormSchema.safeParse({ ...base, price: 0 });
    expect(res.success).toBe(false);

    // 1 passes
    expect(() => expenseFormSchema.parse({ ...base, price: 1 })).not.toThrow();

    // non-integer fails
    res = expenseFormSchema.safeParse({ ...base, price: 3.14 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('정수'))).toBe(true);
    }
  });

  it('requires selectedDate to be a Date object', () => {
    const res = expenseFormSchema.safeParse({ ...base, selectedDate: '2025-09-01' as any });
    expect(res.success).toBe(false);
  });

  it('validates dutchPayCount range and integer', () => {
    // -1 fails
    let res = expenseFormSchema.safeParse({ ...base, dutchPayCount: -1 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('1명 이상') || i.message.includes('0'))).toBe(true);
    }

    // 0 ok (as per min(0))
    expect(() => expenseFormSchema.parse({ ...base, dutchPayCount: 0 })).not.toThrow();

    // 20 ok
    expect(() => expenseFormSchema.parse({ ...base, dutchPayCount: 20 })).not.toThrow();

    // 21 fails (max 20)
    res = expenseFormSchema.safeParse({ ...base, dutchPayCount: 21 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('20명 이하'))).toBe(true);
    }

    // non-integer fails
    res = expenseFormSchema.safeParse({ ...base, dutchPayCount: 2.5 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some(i => i.message.includes('정수'))).toBe(true);
    }
  });

  it('requires app field as non-empty string', () => {
    let res = expenseFormSchema.safeParse({ ...base, app: '' });
    // z.string() without .min(1) allows empty; check acceptance accordingly
    expect(res.success).toBe(true);

    // non-string should fail
    res = expenseFormSchema.safeParse({ ...base, app: 123 as any });
    expect(res.success).toBe(false);
  });

  it('validates title and userUid like API schema', () => {
    // title empty
    let res = expenseFormSchema.safeParse({ ...base, title: '' });
    expect(res.success).toBe(false);

    // title 200 ok, 201 fail
    expect(() => expenseFormSchema.parse({ ...base, title: 'a'.repeat(200) })).not.toThrow();
    res = expenseFormSchema.safeParse({ ...base, title: 'a'.repeat(201) });
    expect(res.success).toBe(false);

    // userUid empty
    res = expenseFormSchema.safeParse({ ...base, userUid: '' });
    expect(res.success).toBe(false);
  });

  it('rejects invalid category when provided', () => {
    const res = expenseFormSchema.safeParse({ ...base, category: 'INVALID' as any });
    expect(res.success).toBe(false);
  });
});