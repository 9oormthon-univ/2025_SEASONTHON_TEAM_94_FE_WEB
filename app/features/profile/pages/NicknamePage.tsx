import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import NicknameForm from '../components/NicknameForm';
import { useNickname } from '../hooks/useNickname';
import { useHideNav } from '@/shared/hooks/useHideNav';
import { toast } from 'sonner';

export default function NicknamePage() {
  useHideNav();
  const navigate = useNavigate();
  const { loading, saving, name, setName, changed, save } = useNickname();

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
            if (!changed) return;
            try {
              const ok = await save();
              if (ok) {
                toast.success("닉네임이 변경되었습니다.");
                navigate("/more");
              } else {
                toast.error("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
              }
            } catch (err: any) {
              const msg =
                err?.response?.data?.message ||
                err?.message ||
                "닉네임 저장 중 오류가 발생했습니다.";
              toast.error(msg);
            }
          }}
        />
      </motion.div>
    </div>
  );
}
