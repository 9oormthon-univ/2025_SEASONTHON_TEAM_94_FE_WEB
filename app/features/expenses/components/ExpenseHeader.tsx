import logoSvg from '@/assets/logo.svg';

export function ExpenseHeader() {
  return (
    <div className="bg-white">
      {/* Logo Header - 가운데 정렬 */}
      <div className="flex justify-center px-6 pt-6 pb-6">
        <img src={logoSvg} alt="그만써" className="h-[25px]" />
      </div>
    </div>
  );
}
