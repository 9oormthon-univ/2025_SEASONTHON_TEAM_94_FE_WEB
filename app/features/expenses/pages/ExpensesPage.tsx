import { Link } from 'react-router';
import PlusIcon from '@/assets/plus.svg?react';
import logoSvg from '@/assets/logo.svg';

export function ExpensesPage() {
  const menuItems = [
    {
      title: '미분류 지출',
      description: '미분류 지출 페이지',
      path: '/expenses/unclassified',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: '고정 지출',
      description: '고정 지출 페이지',
      path: '/expenses/fixed',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: '초과 지출',
      description: '초과 지출 페이지',
      path: '/expenses/over',
      color: 'bg-red-50 text-red-600',
    },
    {
      title: '홈',
      description: '홈 페이지',
      path: '/home',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: '지출달력',
      description: '지출달력 페이지',
      path: '/calendar',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: '프로필',
      description: '프로필 페이지',
      path: '/profile',
      color: 'bg-blue-50 text-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto">
      <div className="bg-white">
        {/* Logo Header - 가운데 정렬 */}
        <div className="flex justify-center px-6 pt-6 pb-6">
          <img src={logoSvg} alt="그만써" className="h-[25px]" />
        </div>
      </div>

      {/* Page Title with Plus Button */}
      <div className="bg-white h-[60px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-col justify-center px-6">
            <h1 className="py-2 text-2xl font-bold text-sub-blue">
              페이지 연결
            </h1>
            <div className="text-sm text-gray-600">
              지출 페이지 작업은 끝났으나 아직 메인쪽 페이지가 안나와서 임시로
              만든 페이지입니다.
            </div>
          </div>

          {/* Plus Button */}
          <Link
            to="/expenses/add"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <PlusIcon className="w-9 h-9" />
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 pt-10 space-y-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center ml-4`}
              >
                <span className="text-xl font-bold">
                  {item.title.charAt(0)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
