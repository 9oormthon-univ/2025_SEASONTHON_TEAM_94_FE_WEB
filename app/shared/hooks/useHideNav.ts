import { useEffect } from 'react';

export function useHideNav() {
  useEffect(() => {
    document.body.classList.add('hide-nav');
    return () => {
      document.body.classList.remove('hide-nav');
    };
  }, []);
}
