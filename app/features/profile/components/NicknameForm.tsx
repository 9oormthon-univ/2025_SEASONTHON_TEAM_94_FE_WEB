// features/profile/components/NicknameForm.tsx
import { useRef } from 'react';
import { Button } from '@/shared/components/ui/button';

type NicknameFormProps = {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
  saving?: boolean;
  changed: boolean;
  onSubmit: () => void | Promise<void>;
};

export default function NicknameForm({
  value,
  onChange,
  loading,
  saving,
  changed,
  onSubmit,
}: NicknameFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = !!loading || !!saving || !changed;

  return (
    <div className="px-5">
      <h2 className="mt-5 !text-2xl font-extrabold !text-sub-blue">
        어떻게 불러드릴까요?
      </h2>
      <p className="mt-1 !text-sm !text-gray-600">
        최대 7자 내의 입력하신 닉네임으로 불려드려요.
      </p>

      <div className="mt-8">
        <input
          type="text"
          maxLength={7}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="
            w-full h-[44px] px-3 !rounded-md
            border !border-sub-blue
            placeholder:text-gray-400
            text-[18px] text-[#333]
            outline-none focus:ring-0 !focus:border-sub-blue
          "
          placeholder="닉네임을 입력하세요."
        />
      </div>

      <div className="fixed left-0 right-0 bottom-10 bg-white/90 backdrop-blur px-4 py-3">
        <Button
          className={`w-full h-[45px] !rounded-[8px] !font-normal ${
            disabled
              ? '!bg-white !text-gray-600 !border-2 !border-sub-blue'
              : '!bg-sub-blue !text-white'
          }`}
          disabled={disabled}
          onClick={async () => {
            await onSubmit();
          }}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
