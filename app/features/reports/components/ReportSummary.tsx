import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { Transaction } from '@/shared/types/expense';

interface ReportSummaryProps {
  expenses: Transaction[];
}

export function ReportSummary({ expenses }: ReportSummaryProps) {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.price, 0);
  const averageAmount = expenses.length > 0 ? Math.floor(totalAmount / expenses.length) : 0;
  const maxAmount = expenses.length > 0 ? Math.max(...expenses.map(e => e.price)) : 0;

  // 실제 API에서는 type별로 필터링
  const fixedExpenses = expenses.filter(e => e.type === 'FIXED_EXPENSE');
  const overExpenses = expenses.filter(e => e.type === 'OVER_EXPENSE');
  const classificationRate = Math.round(((fixedExpenses.length + overExpenses.length) / Math.max(expenses.length, 1)) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">📈</span>
          요약
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-border">
          <span className="text-muted-foreground">평균 지출 금액:</span>
          <span className="font-bold text-foreground">{averageAmount.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-border">
          <span className="text-muted-foreground">가장 큰 지출:</span>
          <span className="font-bold text-foreground">
            {maxAmount.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-muted-foreground">분류 완료율:</span>
          <span className="font-bold text-primary">
            {classificationRate}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
