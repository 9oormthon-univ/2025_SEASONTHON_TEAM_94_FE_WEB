import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { EXPENSE_TYPES, type Transaction } from '@/shared/types/expense';

interface CategoryAnalysisProps {
  expenses: Transaction[];
}

export function CategoryAnalysis({ expenses }: CategoryAnalysisProps) {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.price, 0);
  
  const noneCount = expenses.filter(e => e.type === EXPENSE_TYPES.NONE).length;
  const fixedCount = expenses.filter(e => e.type === EXPENSE_TYPES.FIXED_EXPENSE).length;
  const overCount = expenses.filter(e => e.type === EXPENSE_TYPES.OVER_EXPENSE).length;

  const typeStats = [
    { 
      name: '미분류', 
      count: noneCount, 
      color: 'destructive', 
      amount: expenses.filter(e => e.type === EXPENSE_TYPES.NONE).reduce((sum, e) => sum + e.price, 0), 
      icon: '❓' 
    },
    { 
      name: '고정지출', 
      count: fixedCount, 
      color: 'default', 
      amount: expenses.filter(e => e.type === EXPENSE_TYPES.FIXED_EXPENSE).reduce((sum, e) => sum + e.price, 0), 
      icon: '📅' 
    },
    { 
      name: '초과지출', 
      count: overCount, 
      color: 'secondary', 
      amount: expenses.filter(e => e.type === EXPENSE_TYPES.OVER_EXPENSE).reduce((sum, e) => sum + e.price, 0), 
      icon: '🛒' 
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          카테고리별 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {typeStats.map((stat) => (
          <Card key={stat.name} className="p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <Badge variant={stat.color as any} className="text-sm px-3 py-1 mb-1">
                    {stat.name}
                  </Badge>
                  <div className="text-sm text-muted-foreground">{stat.count}개</div>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground">
                {totalAmount > 0 ? Math.round((stat.amount / totalAmount) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                총 금액: {stat.amount.toLocaleString()}원
              </span>
            </div>
            <Progress
              value={totalAmount > 0 ? (stat.amount / totalAmount) * 100 : 0}
              className="h-3"
            />
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
