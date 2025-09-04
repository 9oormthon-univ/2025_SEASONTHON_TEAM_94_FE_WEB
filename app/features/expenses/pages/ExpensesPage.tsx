import { Link } from 'react-router';
import { Header } from '@/shared/components/Header';
import PlusIcon from '@/assets/plus.svg?react';

export function ExpensesPage() {
  const menuItems = [
    {
      title: '미분류 지출',
      description: '분류되지 않은 지출 내역을 확인하세요',
      path: '/expenses/unclassified',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: '고정 지출',
      description: '정기적으로 발생하는 고정 지출을 관리하세요',
      path: '/expenses/fixed',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: '초과 지출',
      description: '예산을 초과한 지출 내역을 확인하세요',
      path: '/expenses/over',
      color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto">
      <Header />

      {/* Page Title with Plus Button */}
      <div className="bg-white h-[60px]">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="py-2 text-2xl font-bold text-sub-blue">
              지출 관리
            </h1>
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
      <div className="px-6 pt-6 space-y-4">
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
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center ml-4`}>
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
