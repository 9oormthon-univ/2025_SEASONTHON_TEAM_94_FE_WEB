import { redirect } from 'react-router';

export function loader() {
  // 쿠키 확인은 클라이언트에서만 가능하므로 기본적으로 expenses로 리다이렉트
  // 실제 인증 확인은 클라이언트 컴포넌트에서 처리
  return redirect('/expenses');
}

export default function IndexPage() {
  // 이 컴포넌트는 실행되지 않지만, 혹시 모를 경우를 대비해 추가
  return null;
}
