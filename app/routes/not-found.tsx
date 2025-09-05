import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-4">
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <p className="text-sm text-gray-500">
          {countdown}초 후 홈으로 이동합니다...
        </p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          지금 홈으로 이동
        </button>
      </div>
    </div>
  );
}
