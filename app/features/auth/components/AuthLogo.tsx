import logoIcon from '@/assets/logo.svg';

interface AuthLogoProps {
  className?: string;
}

export function AuthLogo({
  className = 'w-53 h-19 brightness-0 invert',
}: AuthLogoProps) {
  return <img src={logoIcon} alt="StopUsing Logo" className={className} />;
}
