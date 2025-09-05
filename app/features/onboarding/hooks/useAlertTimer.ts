import { useEffect } from 'react';

/**
 * Alert 다이얼로그 자동 사라짐을 관리하는 훅
 */
export function useAlertTimer(
  showAlert: boolean,
  setShowAlert: (show: boolean) => void
) {
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, setShowAlert]);
}
