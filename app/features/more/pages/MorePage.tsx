import { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import MiniReport from '../components/MiniReport';
import { fetchCurrentUser, type CurrentUser, logout } from '@/features/more/api/user';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import { Link } from 'react-router-dom';
import { useReport } from '@/features/reports/hooks/useReport';

type MenuItem =
  | { type: 'link'; label: string; to: string }
  | { type: 'external'; label: string; href: string }
  | { type: 'action'; label: string; onClick: () => void };

export default function MorePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const { monthlyGoal, barPercent, percentCenterLeft, barLabel } = useReport();

  useEffect(() => {
    (async () => {
      const me = await fetchCurrentUser();
      setUser(me);
    })();
  }, []);

  const menuItems: MenuItem[] = [
    { type: 'link', label: '서비스 이용약관', to: '/terms' },
    { type: 'external', label: '개발자 링크', href: 'https://example.com' },
    { type: 'link', label: '리뷰쓰기', to: '/reviews/new' },
    { type: 'action', label: '로그아웃', onClick: async () => { await logout(); } },
  ];

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto">
      <ExpenseHeader />

      {/* 본문: 세로 플렉스, 하단 여백은 흰색 영역에서 처리 */}
      <div className="flex flex-col">
        {/* 프로필(평면) */}
        <ProfileCard
          name={user?.name ?? '사용자'}
          email={user?.email ?? ''}
          onEdit={() => {}}
        />

        {/* 프로필 이후 영역을 7:3 비율로 분할 */}
        <div className="flex-1 flex flex-col min-h-[80vh]">
          {/* 7 */}
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

          {/* 3 + 하단바 공간 포함(흰색) */}
          <div className="flex-[3] bg-white ">
            <p><br /><br /></p>
            <nav className="px-6 space-y-10 tracking-wide leading-5">
              {menuItems.map((m) =>
                'to' in m ? (
                  <Link key={m.label} to={m.to} className="block text-[14px] text-[#8F8F8F] no-underline font-light">
                    {m.label}
                  </Link>
                ) : 'href' in m ? (
                  <a key={m.label} href={m.href} target="_blank" rel="noreferrer"
                     className="block text-[14px] text-[#8F8F8F] no-underline font-light">
                    {m.label}
                  </a>
                ) : (
                  <button key={m.label} onClick={m.onClick}
                          className="block w-full text-left text-[14px] text-[#8F8F8F] font-light">
                    {m.label}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
