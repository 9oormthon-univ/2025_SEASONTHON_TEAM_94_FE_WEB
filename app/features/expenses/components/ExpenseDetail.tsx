import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import type { Transaction } from '@/shared/types/expense';

interface ExpenseDetailProps {
  expense: Transaction | null;
  onSave: (expense: Transaction) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ExpenseDetail({
  expense,
  onSave,
  onCancel,
  onDelete,
}: ExpenseDetailProps) {
  if (!expense) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        항목을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-3 space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">지출 상세</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">제목</label>
            <p className="font-semibold">{expense.title}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">금액</label>
            <p className="font-semibold text-lg">
              {expense.price.toLocaleString()}원
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">날짜</label>
            <p>{new Date(expense.startedAt).toLocaleDateString('ko-KR')}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">타입</label>
            <p>
              {expense.type === 'FIXED_EXPENSE'
                ? '고정지출'
                : expense.type === 'OVER_EXPENSE'
                  ? '초과지출'
                  : '미분류'}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">카테고리</label>
            <p>{expense.category}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              삭제
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={onCancel}>
              취소
            </Button>
            <Button size="sm" onClick={() => onSave(expense)}>
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
