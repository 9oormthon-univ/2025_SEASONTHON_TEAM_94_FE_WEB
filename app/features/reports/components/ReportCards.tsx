import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { Transaction } from '@/shared/types/expense';

interface ReportCardsProps {
  expenses: Transaction[];
}

export function ReportCards({ expenses }: ReportCardsProps) {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.price, 0);
  // API에는 sharedWith가 없으므로 개인 부담금은 총액과 동일하게 처리
  const personalAmount = totalAmount;

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">총 지출 금액</p>
              <p className="text-3xl font-bold text-foreground">
                {totalAmount.toLocaleString()}원
              </p>
            </div>
            <div className="text-5xl">💰</div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">개인 부담금</p>
              <p className="text-3xl font-bold text-primary">
                {personalAmount.toLocaleString()}원
              </p>
            </div>
            <div className="text-5xl">👤</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
