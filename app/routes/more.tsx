import MorePage from '@/features/more/pages/MorePage';
import { AuthGuard } from '@/features/auth';

export default function More() {
  return (
    <AuthGuard>
      <MorePage />
    </AuthGuard>
  );
}
