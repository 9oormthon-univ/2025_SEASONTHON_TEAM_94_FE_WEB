import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import NicknameForm from '../components/NicknameForm';
import { useNickname } from '../hooks/useNickname';
import { useHideNav } from '@/shared/hooks/useHideNav';

export default function NicknamePage() {
  useHideNav();
  const navigate = useNavigate();
  const { loading, saving, name, setName, changed, save } = useNickname();

  // 하단 탭바만 숨김
  useEffect(() => {
    const selector = 'nav.fixed.bottom-0.left-0.right-0';
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    const prevDisplay = el.style.display;
    el.style.display = 'none';
    return () => { el.style.display = prevDisplay; };
  }, []);

  return (
    <div className="min-h-screen bg-white relative max-w-md mx-auto pb-20">
      {/* 헤더는 그대로 */}
      <div className="relative px-4 pt-4 pb-2">
        <motion.div
          className="absolute left-4 top-4 p-1 -m-1 rounded hover:bg-black/5 active:bg-black/10"
          aria-label="뒤로"
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.92 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.div>
        <h1 className="text-center text-[15px] font-medium text-black">닉네임 입력/수정</h1>
      </div>

      {/* ✅ 폼(고정버튼 포함)은 opacity만 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <NicknameForm
          value={name}
          onChange={setName}
          loading={loading}
          saving={saving}
          changed={changed}
          onSubmit={async () => {
            const ok = await save();
            if (ok) navigate(-1);
          }}
        />
      </motion.div>
    </div>
  );
}
