import { ExpensesPage } from '@/features/expenses';
import { AuthGuard } from '@/features/auth';

export default function ExpensesIndex() {
  return (
    <AuthGuard>
      <ExpensesPage />
    </AuthGuard>
  );
}
