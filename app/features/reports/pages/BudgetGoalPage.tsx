// features/reports/pages/BudgetGoalPage.tsx
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BudgetGoalForm from '../components/BudgetGoalForm';
import { useBudgetGoal } from '../hooks/useBudgetGoal';
import { useHideNav } from '@/shared/hooks/useHideNav';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BudgetGoalPage() {
  useHideNav();
  const q = useQuery();
  const navigate = useNavigate();

  const id = q.get('id');
  const date = q.get('date') || undefined;

  const { loading, goal, price, setPrice, hasExisting, saving, save } =
    useBudgetGoal({ date, idFromRoute: id ? Number(id) : undefined });

  const title = '목표 초과지출 설정'; // ✅ 수정 페이지도 “저장”만 표기

  // 버튼 활성 조건: 값이 0 초과 && 기존값과 달라졌을 때
  const original = goal?.price ?? 0;
  const changed = price !== original && price > 0;

  return (
    <div className="min-h-screen bg-white relative max-w-md mx-auto pb-24">
      {/* 커스텀 헤더 (가운데 정렬) */}
      <div className="relative top-10 px-4 pt-4 pb-2">
        <div
          onClick={() => navigate(-1)}
          className=" absolute left-4 top-1/2 -translate-y-1 p-1 -m-1 rounded hover:bg-black/5 active:bg-black/10"
          aria-label="뒤로"
        >
          <ChevronLeft className="w-6 h-6" />
        </div>
        <h1 className="text-center text-[15px] font-medium text-black tracking-[-0.165px]">
          {title}
        </h1>
      </div>

      <BudgetGoalForm
        value={price}
        onChange={setPrice}
        loading={loading}
        saving={saving}
        changed={changed}            
        onSubmit={async () => {
          if (!changed) return;
          const ok = await save();
          if (ok) navigate(-1);
        }}
      />
    </div>
  );
}
