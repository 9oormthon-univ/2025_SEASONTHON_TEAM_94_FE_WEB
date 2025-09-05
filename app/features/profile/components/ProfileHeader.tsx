type ProfileHeaderProps = {
  nickname?: string;
  email?: string;
};

export default function ProfileHeader({ nickname, email }: ProfileHeaderProps) {
  // 이메일이 아직 안 오면 임시 placeholder 사용 → 실데이터 오면 자동 대체
  const emailText = (email && email.trim()) || 'user@example.com';

  return (
    <div className="px-5 pt-4 pb-2">
      <div className="mt-15 text-[21px] font-bold text-[#222]">
        {nickname ? `${nickname}님` : '사용자님'}
      </div>

      {emailText && (
        <span
            className="mt-2 inline-flex h-6 items-center justify-center px-3
                    rounded-[6px] bg-[#FF6200] text-white text-[14px]
                    whitespace-nowrap"
        >
            {emailText}
        </span>
        )}
    </div>
  );
}
