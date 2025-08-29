// src/features/more/components/ProfileCard.tsx
import { Card, CardContent } from '@/shared/components/ui/card';

type Props = {
  name: string;
  email: string;
  onEdit?: () => void; // 닉네임 옆 연필 클릭
};

export default function ProfileCard({ name, email, onEdit }: Props) {
  return (
    <section className="px-7 pt-4 pb-2">
      {/* 닉네임 + 연필 아이콘 (한 줄) */}
      <div className="flex items-center gap-2">
        <span className="text-[18px] md:text-[20px] font-semibold text-[#002B5B]">
          {name} 님
        </span>
        <button
          aria-label="닉네임 수정"
          onClick={onEdit}
          className="p-1 -mt-0.5 text-[#002B5B] hover:opacity-80"
        >
          {/* 간단한 연필 기호. 추후 아이콘 라이브러리로 교체 가능 */}
          ✎
        </button>
      </div>

      {/* 이메일 */}
      <div className="mt-1 text-[11px] text-[#757575]">{email}</div>
    </section>
  );
}
