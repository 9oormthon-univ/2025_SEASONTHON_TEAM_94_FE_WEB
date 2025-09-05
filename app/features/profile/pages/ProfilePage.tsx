import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import { useHome } from '@/features/home/hooks/useHome';
import ProgressBar from '@/features/reports/components/ProgressBar';
import { fmt } from '@/features/reports/utils/number';
import { getMe } from '../api/user';
import type { HomeState } from '@/features/home/hooks/useHome';
import LogoutConfirm from '@/features/profile/components/LogoutConfirm';
import nicknameIcon from '@/assets/nickname.svg';
import goalIcon from '@/assets/goal.svg';
import rightIcon from '@/assets/right.svg';


export default function ProfilePage() {
  const navigate = useNavigate();
  const { userName, total: totalRaw, monthlyGoal: monthlyGoalRaw, ratio: ratioRaw, isOver, hasGoal } = useHome();

  const total = Number(totalRaw) || 0;
  const monthlyGoal = Number(monthlyGoalRaw) || 0;
  const ratioSafeNum = Number.isFinite(Number(ratioRaw)) ? Math.max(0, Math.min(100, Number(ratioRaw))) : 0;

  const state: HomeState = !hasGoal ? 'EMPTY' : isOver ? 'OVER' : 'NORMAL';
  const themeColor = state === 'OVER' ? '#EF4444' : state === 'EMPTY' ? '#757575' : '#10B981';

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
        const me = await getMe(abort.signal);
        setNickname(me.nickname?.trim() || me.username?.trim() || '');
        setEmail(me.email || '');
      } catch {}
    })();
    return () => abort.abort();
  }, []);

  const onEditGoal = () => navigate('/profile/budget-goal');

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto pb-28">
      <ProfileHeader nickname={nickname || userName} email={email} />

      <div className="mx-5 mt-1 h-[2px] bg-sub-gray rounded-md" />
      <div className="px-5 mt-6 space-y-3">
        <Link
          to="/expenses/over"
          aria-label="지출 상세로 이동"
          className="relative block rounded-2xl bg-[#F6F6F6] px-5 py-5 min-h-[110px]"
        >
          <div className="text-[15px] font-semibold text-[#111111]">지출</div>
          <img
            src={rightIcon}
            alt=""
            aria-hidden="true"
            className="absolute right-5 top-10 w-5 h-5 opacity-60"
          />
          <div className="mt-2 text-[22px] font-semibold text-[#111827]">
            - {fmt(Math.max(0, total))}
          </div>
        </Link>

        <section>
          <div className="px-5">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-medium text-[#111827]">목표 지출</div>
              {hasGoal && (
                <span className="text-[14px] font-semibold text-[#111827] whitespace-nowrap">
                  - {fmt(monthlyGoal)}
                </span>
              )}
            </div>

            <div className="mt-2 ">
                <ProgressBar
                  barPercent={hasGoal ? ratioSafeNum : 0}
                  percentCenterLeft={hasGoal ? ratioSafeNum : 0}
                  barLabel=""
                  goalLabel={undefined}
                  isOver={isOver}
                  themeColor={themeColor}
                />
            </div>

            <div className="mt-1 flex items-center justify-between text-[14px]">
              <span className="font-semibold transition-colors" style={{ color: themeColor }}>
                - {fmt(Math.max(0, total))}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="font-bold h-[50px] rounded-[8px] border-[#D1D5DB] text-[#BFBFBF] inline-flex items-center justify-center gap-2"
                onClick={() => navigate('/profile/nickname')}
              >
                <img src={nicknameIcon} alt="" aria-hidden="true" className="w-4 h-4" />
                닉네임 변경
              </Button>
              <Button
                variant="outline"
                className="font-bold h-[50px] rounded-[8px] border-[#D1D5DB] text-[#BFBFBF] inline-flex items-center justify-center gap-2"
                onClick={onEditGoal}
              >
                <img src={goalIcon} alt="" aria-hidden="true" className="w-4 h-4" />
                목표지출 변경
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6 mt-8 px-5">
          <a
            href="https://leestana01.notion.site/25e704f432e08050a0b8d59349165246?source=copy_link"
            target="_blank"
            rel="noreferrer"
            className="block text-[14px] text-[#BFBFBF] no-underline font-bold"
          >
            서비스 이용약관
          </a>

          <a
            href="https://linktr.ee/2025_seasonthon_team_94"
            target="_blank"
            rel="noreferrer"
            className="block text-[14px] text-[#BFBFBF] no-underline font-bold"
          >
            개발자 링크
          </a>

          <a
            href="https://smore.im/form/AY6WvhcQId"
            target="_blank"
            rel="noreferrer"
            className="block text-[14px] text-[#BFBFBF] no-underline font-bold"
          >
            어플 리뷰 적기
          </a>

          <LogoutConfirm redirectTo="/auth">
            <button className="block w-full text-left text-[14px] text-[#BFBFBF] font-bold">
              로그아웃
            </button>
          </LogoutConfirm>
        </section>
      </div>
    </div>
  );
}
