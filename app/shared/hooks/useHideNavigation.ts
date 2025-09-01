import { useEffect } from 'react';

const HIDE_NAV_STYLE_ID = 'hide-global-bottom-fixed';

/**
 * 전역 하단 네비게이션을 숨기는 훅
 * 컴포넌트가 마운트될 때 네비게이션을 숨기고, 언마운트될 때 복원합니다.
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
