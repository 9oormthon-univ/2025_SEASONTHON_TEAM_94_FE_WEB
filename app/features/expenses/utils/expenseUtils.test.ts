/**
 * Tests for expenseUtils
 *
 * Framework note:
 * - Using Jest style APIs (describe/it/expect, jest.useFakeTimers).
 * - If your project uses Vitest, replace:
 *     - jest.useFakeTimers() -> vi.useFakeTimers()
 *     - jest.setSystemTime() -> vi.setSystemTime()
 *     - jest.useRealTimers() -> vi.useRealTimers()
 *   and optionally import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
 */

import {
  formatDate,
  formatDateTime,
  formatExpenseDate,
  getTodayYMD,
} from './expenseUtils';

// Ensure deterministic timezone for locale formatting
const ORIGINAL_TZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = 'Asia/Seoul';
});
afterAll(() => {
  process.env.TZ = ORIGINAL_TZ;
});

describe('expenseUtils - date formatting', () => {
  describe('formatDate', () => {
    it('formats month/day in ko-KR locale for a standard ISO string', () => {
      const iso = '2024-12-05T12:34:56+09:00';
      const expected = new Date(iso).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
      expect(formatDate(iso)).toBe(expected);
    });

    it('respects timezone (Asia/Seoul) to avoid day-shift across zones', () => {
      // 00:30 KST on March 1, 2025
      const iso = '2025-03-01T00:30:00+09:00';
      const expected = new Date(iso).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
      expect(formatDate(iso)).toBe(expected);
    });

    it('throws RangeError for invalid date input', () => {
      // new Date('not-a-date') -> Invalid Date; toLocaleDateString should throw RangeError
      expect(() => formatDate('not-a-date')).toThrow(RangeError);
    });
  });

  describe('formatDateTime', () => {
    it('combines date and 24-hour HH:MM time without seconds', () => {
      const iso = '2025-02-15T09:05:00+09:00';
      const d = new Date(iso);
      const expectedDate = d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
      const expectedTime = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
      expect(formatDateTime(iso)).toBe(`${expectedDate} ${expectedTime}`);
    });

    it('handles midnight and single-digit minutes (leading zero)', () => {
      const iso = '2025-01-01T00:07:00+09:00';
      const d = new Date(iso);
      const expectedDate = d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
      const expectedTime = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
      // Expect "00:07" format
      expect(expectedTime).toMatch(/^\d{2}:\d{2}$/);
      expect(formatDateTime(iso)).toBe(`${expectedDate} ${expectedTime}`);
    });

    it('throws RangeError for invalid date input', () => {
      expect(() => formatDateTime('invalid')).toThrow(RangeError);
    });
  });

  describe('formatExpenseDate', () => {
    it('renders "M월 D일 요일 HH:MM:SS" with correct Korean weekday', () => {
      // Monday, July 8, 2024 14:09:30 KST
      const iso = '2024-07-08T14:09:30+09:00';
      const d = new Date(iso);
      const weekdays = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
      const expected = `${d.getMonth() + 1}월 ${d.getDate()}일 ${weekdays[d.getDay()]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
      expect(formatExpenseDate(iso)).toBe(expected);
    });

    it('pads hours, minutes, seconds with leading zeros', () => {
      // 03:04:05 -> should format to "03:04:05"
      const iso = '2025-04-09T03:04:05+09:00';
      const out = formatExpenseDate(iso);
      expect(out).toMatch(/\d+월 \d+일 .+요일 03:04:05$/);
    });

    it('returns original input when an exception occurs (defensive path)', () => {
      // Force error path by monkey-patching Date constructor locally
      const originalDate = global.Date;
      // @ts-expect-error – override for test
      global.Date = class BadDate extends originalDate {
        constructor(value?: any) {
          // Simulate a ctor that throws for this specific test
          if (value === 'boom') {
            // @ts-ignore
            throw new Error('bad date constructor');
          }
          super(value);
        }
      } as unknown as DateConstructor;

      try {
        const input = 'boom';
        const result = formatExpenseDate(input);
        expect(result).toBe(input);
      } finally {
        global.Date = originalDate;
      }
    });
  });

  describe('getTodayYMD', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns today in YYYY-MM-DD with zero-padded month/day', () => {
      // Freeze time: September 1, 2025, 10:23:45 KST
      jest.setSystemTime(new Date('2025-09-01T10:23:45+09:00'));
      expect(getTodayYMD()).toBe('2025-09-01');

      // Another date with single-digit month/day -> expect zero padding
      jest.setSystemTime(new Date('2025-03-07T23:59:59+09:00'));
      expect(getTodayYMD()).toBe('2025-03-07');
    });
  });
});