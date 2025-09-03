import { ExpenseAddPage } from '@/features/expenses';
import { AuthGuard } from '@/features/auth';

export default function AddExpensePage() {
  return (
    <AuthGuard>
      <ExpenseAddPage />
    </AuthGuard>
  );
}
