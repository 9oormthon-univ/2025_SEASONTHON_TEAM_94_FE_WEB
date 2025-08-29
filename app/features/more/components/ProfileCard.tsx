// features/more/components/ProfileCard.tsx
import editIconUrl from '@/assets/edit.svg?url';

type Props = {
  name: string;
  email: string;
  onEdit?: () => void; 
};

export default function ProfileCard({ name, email, onEdit }: Props) {
  return (
    <section className="px-7 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <span className="text-[18px] md:text-[20px] font-semibold text-[#002B5B]">
          {name} 님
        </span>
        <button
          aria-label="닉네임 수정"
          onClick={onEdit}
          className="p-1 -mt-0.5 hover:opacity-80"
        >
          <img src={editIconUrl} alt="편집" className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-1 text-[11px] text-[#757575]">{email}</div>
    </section>
  );
}
