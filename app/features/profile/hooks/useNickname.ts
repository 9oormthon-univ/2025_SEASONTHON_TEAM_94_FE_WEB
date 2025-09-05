// features/profile/hooks/useNickname.ts
import { useEffect, useMemo, useState } from 'react';
import { getMe, updateNickname as putNickname } from '../api/user';

export function useNickname() {
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [original, setOriginal] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const me = await getMe();
        const initial = (me.nickname?.trim() || me.username?.trim() || '');
        setOriginal(initial);
        setName(initial);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const changed = useMemo(
    () => name.trim() !== original.trim(),
    [name, original]
  );

  const save = async () => {
    if (!changed || saving) return false;
    setSaving(true);
    try {
      const updated = await putNickname(name.trim());
      const finalName = updated.nickname?.trim() || updated.username?.trim() || '';
      setOriginal(finalName);
      setName(finalName);

      window.dispatchEvent(
        new CustomEvent('nickname:changed', { detail: { nickname: finalName } })
      );
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { loading, saving, name, setName, changed, save };
}
