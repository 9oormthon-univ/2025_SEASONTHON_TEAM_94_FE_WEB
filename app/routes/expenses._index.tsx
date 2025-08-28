import { Link, useSearchParams } from 'react-router';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EXPENSE_CATEGORIES, type Expense } from '@/lib/constants';

export default function ExpensesIndex() {
  const { expenses } = useExpenses();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') as 'unclassified' | 'classified' || 'unclassified';

  const unclassified = expenses.filter(e => e.category === EXPENSE_CATEGORIES.UNCLASSIFIED);
  const fixed = expenses.filter(e => e.category === EXPENSE_CATEGORIES.FIXED);
  const additional = expenses.filter(e => e.category === EXPENSE_CATEGORIES.ADDITIONAL);
  const classified = [...fixed, ...additional];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderList = (list: Expense[]) => {
    if (list.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-muted-foreground text-base">항목이 없습니다.</p>
          </CardContent>
        </Card>
      );
    }

    return list.map(exp => (
      <Link to={`/expenses/${exp.id}`} key={exp.id} className="block">
        <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary/20 active:scale-[0.98]">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-1">{exp.place}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{formatDate(exp.date)}</p>
                  <Badge variant={exp.category === EXPENSE_CATEGORIES.UNCLASSIFIED ? 'destructive' : 'default'} className="text-xs">
                    {exp.category === EXPENSE_CATEGORIES.FIXED ? '고정' : exp.category === EXPENSE_CATEGORIES.ADDITIONAL ? '추가' : '미분류'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-foreground mb-1">
                  {Math.floor(exp.amount / exp.sharedWith).toLocaleString()}원
                </div>
                <div className="text-sm text-muted-foreground">
                  총 {exp.amount.toLocaleString()}원
                </div>
                {exp.sharedWith > 1 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {exp.sharedWith}명 분할
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center pb-6">
          <div className="text-4xl mb-4">{activeTab === 'unclassified' ? '❓' : '✅'}</div>
          <CardTitle className="text-2xl font-bold">
            {activeTab === 'unclassified' ? '미분류 지출' : '분류된 지출'}
          </CardTitle>
          <p className="text-muted-foreground text-base">
            {activeTab === 'unclassified' 
              ? `${unclassified.length}개의 미분류 항목` 
              : `${classified.length}개의 분류된 항목`}
          </p>
        </CardHeader>
      </Card>

      {/* Content based on active tab */}
      <div className="space-y-3">
        {activeTab === 'unclassified' ? (
          unclassified.length > 0 ? (
            renderList(unclassified)
          ) : (
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold mb-2">모든 지출이 분류되었어요!</h3>
                <p className="text-muted-foreground text-sm">미분류 항목이 없습니다.</p>
              </CardContent>
            </Card>
          )
        ) : (
          classified.length > 0 ? (
            renderList(classified)
          ) : (
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">분류된 지출이 없어요</h3>
                <p className="text-muted-foreground text-sm">지출을 추가하고 분류해보세요.</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
