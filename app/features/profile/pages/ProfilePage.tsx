import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import ProfileHeader from '../components/ProfileHeader';
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

  // 프로필: 이메일이 비어 있으면 Header에서 placeholder 처리
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

  const onEditGoal = () => navigate('/reports/budget-goal');

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto pb-12">
      <ProfileHeader nickname={nickname || userName} email={email} />

      {/* 지출 카드와 동일 폭의 회색 구분선 */}
      <div className="mx-5 mt-1 h-[2px] bg-[#BFBFBF] rounded-md" />

      <div className="px-5 mt-6 space-y-8">
        {/* 지출: 아이콘을 absolute로 고정 → 높이 변화 없음 */}
        <Link
          to="/expenses"
          aria-label="지출 상세로 이동"
          className="relative block rounded-2xl bg-[#F6F6F6] px-5 py-5 min-h-[110px]"
        >
          <div className="text-[15px] font-semibold text-[#111111]">지출</div>
          {/* 화살표만 아래로 위치 조정, 카드 높이에 영향 X */}
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

        {/* 목표 지출: 지출 카드 내부 폭과 동일하게 정렬(px-5) */}
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

            {/* 바: 얇게 */}
            <div className="mt-2">
              <div className="transform scale-y-75 origin-left">
                <ProgressBar
                  barPercent={hasGoal ? ratioSafeNum : 0}
                  percentCenterLeft={hasGoal ? ratioSafeNum : 0}
                  barLabel=""
                  goalLabel={undefined}
                  isOver={isOver}
                  themeColor={themeColor}
                />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[14px]">
              <span className="font-semibold" style={{ color: '#10B981' }}>
                - {fmt(Math.max(0, total))}
              </span>
            </div>

            {/* 액션 버튼들 */}
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

        {/* 메뉴는 그대로 아래(여백 크게) */}
        <section className="space-y-8 mt-12 px-5">
          <Link to="/terms" className="block text-[14px] text-[#BFBFBF] no-underline font-bold">
            서비스 이용약관
          </Link>
          <a
            href="https://example.com"
            target="_blank"
            rel="noreferrer"
            className="block text-[14px] text-[#BFBFBF] no-underline font-bold"
          >
            개발자 링크
          </a>
          <Link to="/reviews/new" className="block text-[14px] text-[#BFBFBF] no-underline font-bold">
            어플 리뷰 적기
          </Link>
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
