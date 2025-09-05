import ProfilePage from '@/features/profile/pages/ProfilePage';
import { AuthGuard } from '@/features/auth';

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
