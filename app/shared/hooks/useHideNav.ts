import { useEffect } from 'react';

const HIDE_NAV_STYLE_ID = 'hide-global-bottom-fixed';

/**
 * 전역 하단 네비게이션을 숨기는 훅
 * 기존 클래스 기반 방식과 스타일 삽입 방식을 모두 지원
 */
export function useHideNav() {
  useEffect(() => {
    document.body.classList.add('hide-nav');
    return () => {
      document.body.classList.remove('hide-nav');
    };
  }, []);
}

/**
 * 스타일 삽입을 통해 네비게이션을 숨기는 훅
 * 더 강력한 숨김 효과가 필요한 경우 사용
 */
export function useHideNavigation() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = HIDE_NAV_STYLE_ID;
    style.innerHTML = `nav.fixed.bottom-0.left-0.right-0{ display:none !important; }`;
    document.head.appendChild(style);
    
    return () => { 
      document.getElementById(HIDE_NAV_STYLE_ID)?.remove(); 
    };
  }, []);
}
