import { ExpenseDetailPage } from '@/features/expenses';
import { AuthGuard } from '@/features/auth';

export default function ExpenseDetail() {
  return (
    <AuthGuard>
      <ExpenseDetailPage />
    </AuthGuard>
  );
}
