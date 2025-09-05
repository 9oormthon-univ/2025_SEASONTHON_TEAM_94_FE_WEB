import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';

import HomeIcon from '@/assets/home.svg?react';
import Calendar from '@/assets/calendar.svg?react';
import ProfileIcon from '@/assets/profile.svg?react';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="h-16 fixed bottom-0 left-0 right-0 bg-white border-t border-sub-gray flex justify-around items-center py-1 bottom-nav rounded-t-2xl shadow-lg">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Link
          to="/home"
          className={`flex flex-col items-center py-1 px-4 ${
            location.pathname.startsWith('/home')
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}
        >
          <motion.div
            animate={{
              scale: location.pathname.startsWith('/home') ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <HomeIcon
              className={`w-6 h-6 mb-2 ${
                location.pathname.startsWith('/home')
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`}
            />
          </motion.div>
          <motion.span
            className="text-xs"
            animate={{
              fontWeight: location.pathname.startsWith('/home') ? 600 : 400,
            }}
            transition={{ duration: 0.2 }}
          >
            홈
          </motion.span>
        </Link>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Link
          to="/calendar"
          className={`flex flex-col items-center py-1 px-4 ${
            location.pathname.startsWith('/calendar')
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}
        >
          <motion.div
            animate={{
              scale: location.pathname.startsWith('/calendar') ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Calendar
              className={`w-6 h-6 mb-2 ${
                location.pathname.startsWith('/calendar')
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`}
            />
          </motion.div>
          <motion.span
            className="text-xs"
            animate={{
              fontWeight: location.pathname.startsWith('/calendar') ? 600 : 400,
            }}
            transition={{ duration: 0.2 }}
          >
            지출달력
          </motion.span>
        </Link>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Link
          to="/profile"
          className={`flex flex-col items-center py-1 px-4 ${
            location.pathname.startsWith('/profile')
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}
        >
          <motion.div
            animate={{
              scale: location.pathname.startsWith('/profile') ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ProfileIcon
              className={`w-6 h-6 mb-2 ${
                location.pathname.startsWith('/profile')
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`}
            />
          </motion.div>
          <motion.span
            className="text-xs"
            animate={{
              fontWeight: location.pathname.startsWith('/profile') ? 600 : 400,
            }}
            transition={{ duration: 0.2 }}
          >
            프로필
          </motion.span>
        </Link>
      </motion.div>
    </nav>
  );
}
