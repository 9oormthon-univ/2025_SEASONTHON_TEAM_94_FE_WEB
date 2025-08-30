import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/ProfileCard';
import MiniReport from '../components/MiniReport';
import { fetchCurrentUser, type CurrentUser, logout } from '@/features/more/api/user';
import { ExpenseHeader } from '@/features/expenses/components/ExpenseHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useReport } from '@/features/reports/hooks/useReport';
import LogoutConfirm from "@/features/more/components/LogoutConfirm";

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-[rgba(235,235,235,0.35)]/95 backdrop-blur supports-[backdrop-filter]:bg-[rgba(235,235,235,0.35)]">
            <ProfileCard
              name={user?.name ?? '사용자'}
              email={user?.email ?? ''}
              onEdit={() => navigate('/profile/nickname')}
            />
          </div>

          <div className="flex-1 flex flex-col min-h-[80vh]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.2 }}
            >
              <MiniReport
                className="h-full"
                title="초과지출"
                barPercent={barPercent}
                percentCenterLeft={percentCenterLeft}
                barLabel={barLabel}
                monthlyGoal={monthlyGoal}
              />
            </motion.div>

            <div className="flex-[3] mt-40 bg-white">
              <p><br /><br /></p>
              <nav className="px-6 space-y-10 tracking-wide leading-5 ">
                {menuItems.map((m, idx) => {
                  const delay = 0.14 + idx * 0.05;
                  if (m.type === 'link') {
                    return (
                      <Link key={m.label} to={m.to} className="block text-[14px] text-[#8F8F8F] no-underline font-light">
                        <motion.span
                          className="inline-block"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay, duration: 0.2 }}
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {m.label}
                        </motion.span>
                      </Link>
                    );
                  }
                  if (m.type === 'external') {
                    return (
                      <a key={m.label} href={m.href} target="_blank" rel="noreferrer"
                         className="block text-[14px] text-[#8F8F8F] no-underline font-light">
                        <motion.span
                          className="inline-block"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay, duration: 0.2 }}
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {m.label}
                        </motion.span>
                      </a>
                    );
                  }
                  return (
                    <LogoutConfirm key={m.label} redirectTo="/">
                      <motion.button
                        className="block w-full text-left text-[14px] text-[#8F8F8F] font-light"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay, duration: 0.2 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {m.label}
                      </motion.button>
                    </LogoutConfirm>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
