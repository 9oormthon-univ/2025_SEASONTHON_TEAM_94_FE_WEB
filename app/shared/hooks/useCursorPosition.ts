import { useCallback } from 'react';

/**
 * 모바일에서 포커스 시 커서 위치를 유지하는 훅
 * 사용자가 탭한 위치의 커서를 유지하도록 도와줍니다.
 */
export function useCursorPosition() {
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.target;
    const cursorPosition = el.selectionStart ?? el.value.length;
    
    requestAnimationFrame(() => {
      try { 
        el.setSelectionRange(cursorPosition, cursorPosition); 
      } catch {
        // setSelectionRange가 실패할 수 있는 경우를 대비한 빈 catch 블록
      }
    });
  }, []);

  return { handleFocus };
}
