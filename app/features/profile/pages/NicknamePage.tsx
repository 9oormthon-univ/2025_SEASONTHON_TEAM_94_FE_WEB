// features/profile/pages/NicknamePage.tsx
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import NicknameForm from '../components/NicknameForm';
import { useNickname } from '../hooks/useNickname';

export default function NicknamePage() {
  const navigate = useNavigate();
  const { loading, saving, name, setName, changed, save } = useNickname();

  return (
    <div className="min-h-screen bg-white relative max-w-md mx-auto pb-20">
      <div className="relative px-4 pt-4 pb-2">
        <div
          className="absolute left-4 top-4 p-1 -m-1 rounded hover:bg-black/5 active:bg-black/10"
          aria-label="뒤로"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-6 h-6" />
        </div>
        <h1 className="text-center text-[15px] font-medium text-black">닉네임 입력/수정</h1>
      </div>

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

      <style>{`.fixed.bottom-0.left-0.right-0{ display:none !important; }`}</style>
    </div>
  );
}