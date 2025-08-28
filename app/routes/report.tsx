import { useExpenses } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

export default function Report() {
  const { expenses } = useExpenses();

  // 지출 분석 데이터 계산
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const personalAmount = expenses.reduce((sum, exp) => sum + (exp.amount / exp.sharedWith), 0);
  const unclassifiedCount = expenses.filter(e => e.category === EXPENSE_CATEGORIES.UNCLASSIFIED).length;
  const fixedCount = expenses.filter(e => e.category === EXPENSE_CATEGORIES.FIXED).length;
  const additionalCount = expenses.filter(e => e.category === EXPENSE_CATEGORIES.ADDITIONAL).length;

  const categoryStats = [
    { name: '미분류', count: unclassifiedCount, color: 'destructive', amount: expenses.filter(e => e.category === EXPENSE_CATEGORIES.UNCLASSIFIED).reduce((sum, e) => sum + e.amount, 0), icon: '❓' },
    { name: '고정지출', count: fixedCount, color: 'default', amount: expenses.filter(e => e.category === EXPENSE_CATEGORIES.FIXED).reduce((sum, e) => sum + e.amount, 0), icon: '📅' },
    { name: '추가지출', count: additionalCount, color: 'secondary', amount: expenses.filter(e => e.category === EXPENSE_CATEGORIES.ADDITIONAL).reduce((sum, e) => sum + e.amount, 0), icon: '🛒' },
  ];

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="text-6xl mb-6">📊</div>
            <CardTitle className="mb-4 text-xl font-bold">아직 지출 내역이 없어요</CardTitle>
            <p className="text-muted-foreground text-base">지출을 추가하면 리포트를 볼 수 있습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center pb-6">
          <div className="text-4xl mb-4">📊</div>
          <CardTitle className="text-2xl font-bold">지출 리포트</CardTitle>
          <p className="text-muted-foreground text-base">총 {expenses.length}개의 지출 항목</p>
        </CardHeader>
      </Card>

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
                  {Math.floor(personalAmount).toLocaleString()}원
                </p>
              </div>
              <div className="text-5xl">👤</div>
            </div>
          </CardContent>
        </Card>
      </div>

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
          {categoryStats.map((stat) => (
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
            <span className="font-bold text-foreground">{expenses.length > 0 ? Math.floor(totalAmount / expenses.length).toLocaleString() : 0}원</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">가장 큰 지출:</span>
            <span className="font-bold text-foreground">
              {expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)).toLocaleString() : 0}원
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-muted-foreground">분류 완료율:</span>
            <span className="font-bold text-primary">
              {Math.round(((fixedCount + additionalCount) / Math.max(expenses.length, 1)) * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
