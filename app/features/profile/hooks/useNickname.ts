// features/profile/hooks/useNickname.ts
import { useEffect, useMemo, useState } from 'react';
import { updateNickname as putNickname } from '../api/user';

const USER_UID = 'a'; // 실제 userUid로 교체

export function useNickname() {
  const [loading, setLoading] = useState(false);   
  const [saving, setSaving]   = useState(false);
  const [original, setOriginal] = useState('');    
  const [name, setName]         = useState('');

  useEffect(() => { /* noop */ }, []);

  const changed = useMemo(() => name.trim() !== original.trim(), [name, original]);

  const save = async () => {
    if (!changed || saving) return false;
    setSaving(true);
    try {
      await putNickname(USER_UID, name.trim());
      setOriginal(name.trim());
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { loading, saving, name, setName, changed, save };
}
