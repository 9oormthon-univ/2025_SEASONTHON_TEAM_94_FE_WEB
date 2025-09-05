import { useState } from 'react';

/**
 * 닉네임 폼 상태와 입력 처리를 관리하는 훅
 */
export function useNicknameForm() {
  const [nickname, setNickname] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleNicknameChange = (value: string) => {
    if (value.length > 7) {
      setShowAlert(true);
      return;
    }
    setNickname(value);
    setIsFormValid(value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      nickname.length === 7 &&
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight'
    ) {
      setShowAlert(true);
      e.preventDefault();
    }
  };

  return {
    nickname,
    isFormValid,
    showAlert,
    setShowAlert,
    handleNicknameChange,
    handleKeyDown,
  };
}
