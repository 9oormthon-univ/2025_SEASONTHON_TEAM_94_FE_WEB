import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { useExpenses } from '@/features/expenses/hooks/useExpenses';
import { ReportCards } from '../components/ReportCards';
import { CategoryAnalysis } from '../components/CategoryAnalysis';
import { ReportSummary } from '../components/ReportSummary';

export function ReportsPage() {
  const { expenses, loading, error, refreshExpenses } = useExpenses();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg border border-red-200 p-6 max-w-md">
          <div className="text-red-600 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={refreshExpenses}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <CardTitle className="text-2xl font-bold mb-2">지출 리포트</CardTitle>
          <p className="text-muted-foreground text-base">총 {expenses.length}개의 지출 항목</p>
        </CardContent>
      </Card>

      <ReportCards expenses={expenses} />

      <CategoryAnalysis expenses={expenses} />

      <ReportSummary expenses={expenses} />
    </div>
  );
}
