import { Link, useLocation } from 'react-router';

import HomeIcon from '@/assets/home.svg?react';
import Calendar from '@/assets/calendar.svg?react';
import ProfileIcon from '@/assets/profile.svg?react';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="h-16 fixed bottom-0 left-0 right-0 bg-white border-t border-sub-gray flex justify-around items-center py-1 bottom-nav rounded-t-2xl shadow-lg">
      <Link
        to="/home"
        className={`flex flex-col items-center py-1 px-4 ${
          location.pathname.startsWith('/home')
            ? 'text-gray-800'
            : 'text-gray-400'
        }`}
      >
        <HomeIcon
          className={`w-6 h-6 mb-2 ${
            location.pathname.startsWith('/home')
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}
        />
        <span className="text-xs">홈</span>
      </Link>
      <Link
        to="/calendar"
        className={`flex flex-col items-center py-1 px-4 ${
          location.pathname.startsWith('/calendar')
            ? 'text-gray-800'
            : 'text-gray-400'
        }`}
      >
        <Calendar
          className={`w-6 h-6 mb-2 ${
            location.pathname.startsWith('/calendar')
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}
        />
        <span className="text-xs">지출달력</span>
      </Link>
      <Link
        to="/profile"
        className={`flex flex-col items-center py-1 px-4 ${
          location.pathname.startsWith('/profile')
            ? 'text-gray-800'
            : 'text-gray-400'
        }`}
      >
        <ProfileIcon
          className={`w-6 h-6 mb-2 ${
            location.pathname.startsWith('/profile')
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}
        />
        <span className="text-xs">프로필</span>
      </Link>
    </nav>
  );
}
