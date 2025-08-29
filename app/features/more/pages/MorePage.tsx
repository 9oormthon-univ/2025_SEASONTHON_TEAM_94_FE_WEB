// features/more/pages/MorePage.tsx
import { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import MiniReport from '../components/MiniReport';
import { fetchCurrentUser, type CurrentUser, logout } from '@/features/more/api/user';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useReport } from '@/features/reports/hooks/useReport';

export default function MorePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const { monthlyGoal, barPercent, percentCenterLeft, barLabel } = useReport();

  useEffect(() => {
    (async () => {
      const me = await fetchCurrentUser('a'); // 현재 테스트용
      setUser(me);
    })();
  }, []);

  useEffect(() => {
    const onChanged = (e: Event) => {
      const { nickname } = (e as CustomEvent).detail || {};
      if (!nickname) return;
      setUser((prev) => (prev ? { ...prev, name: nickname } : prev));
    };
    window.addEventListener('nickname:changed', onChanged as EventListener);
    return () => window.removeEventListener('nickname:changed', onChanged as EventListener);
  }, []);

  const menuItems = [
    { type: 'link', label: '서비스 이용약관', to: '/terms' } as const,
    { type: 'external', label: '개발자 링크', href: 'https://example.com' } as const,
    { type: 'link', label: '리뷰쓰기', to: '/reviews/new' } as const,
    { type: 'action', label: '로그아웃', onClick: async () => { await logout(); } } as const,
  ];

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto">
      <ExpenseHeader />

      <div className="flex flex-col">
        <ProfileCard
          name={user?.name ?? '사용자'}
          email={user?.email ?? ''}
          onEdit={() => navigate('/profile/nickname')}
        />

        <div className="flex-1 flex flex-col min-h-[80vh]">
          <div className="flex-[5]">
            <MiniReport
              className="h-full"
              title="초과지출"
              barPercent={barPercent}
              percentCenterLeft={percentCenterLeft}
              barLabel={barLabel}
              monthlyGoal={monthlyGoal}
            />
          </div>

          <div className="flex-[3] bg-white ">
            <p><br /><br /></p>
            <nav className="px-6 space-y-10 tracking-wide leading-5">
              {menuItems.map((m) => {
                if (m.type === 'link') {
                  return (
                    <Link key={m.label} to={m.to} className="block text-[14px] text-[#8F8F8F] no-underline font-light">
                      {m.label}
                    </Link>
                  );
                }
                if (m.type === 'external') {
                  return (
                    <a key={m.label} href={m.href} target="_blank" rel="noreferrer"
                      className="block text-[14px] text-[#8F8F8F] no-underline font-light">
                      {m.label}
                    </a>
                  );
                }
                return (
                  <button key={m.label} onClick={m.onClick}
                          className="block w-full text-left text-[14px] text-[#8F8F8F] font-light">
                    {m.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
