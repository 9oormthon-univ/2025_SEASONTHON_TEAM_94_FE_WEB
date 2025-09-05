interface OnboardingHeaderProps {
  title: React.ReactNode;
  description: React.ReactNode;
}

/**
 * 온보딩 페이지의 제목과 설명을 표시하는 공통 컴포넌트
 */
export function OnboardingHeader({
  title,
  description,
}: OnboardingHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-base font-medium text-sub-gray">{description}</p>
    </div>
  );
}
