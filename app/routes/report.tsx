import ReportPage from '@/features/reports/pages/ReportsPage';
import { AuthGuard } from '@/features/auth';

export default function Report() {
  return (
    <AuthGuard>
      <ReportPage />
    </AuthGuard>
  );
}
