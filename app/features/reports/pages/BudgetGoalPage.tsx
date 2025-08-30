import { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const title = '목표 초과지출 설정';
  const original = goal?.price ?? 0;
  const changed = price !== original && price > 0;

  useEffect(() => {
    const id = 'hide-global-bottom-fixed';
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `nav.fixed.bottom-0.left-0.right-0{ display:none !important; }`;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white relative max-w-md mx-auto pb-24">
      {/* 헤더는 그대로 */}
      <div className="relative top-10 px-4 pt-4 pb-2">
        <motion.div
          onClick={() => navigate(-1)}
          className=" absolute left-4 top-1/2 -translate-y-1 p-1 -m-1 rounded hover:bg-black/5 active:bg-black/10"
          aria-label="뒤로"
          whileTap={{ scale: 0.92 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.div>
        <h1 className="text-center text-[15px] font-medium text-black tracking-[-0.165px]">
          {title}
        </h1>
      </div>

      {/* ✅ 폼(고정버튼 포함)은 opacity만 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
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
      </motion.div>
    </div>
  );
}
