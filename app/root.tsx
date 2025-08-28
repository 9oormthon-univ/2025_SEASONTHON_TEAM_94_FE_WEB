import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { Link, useLocation } from 'react-router';

import type { Route } from './+types/root';
import '@/app.css';
import { ExpenseProvider } from '@/features/expenses/hooks/useExpenses';

import { ReactComponent as HomeIcon } from '@/assets/home.svg';
import { ReactComponent as ReportIcon } from '@/assets/report.svg';
import { ReactComponent as MoreIcon } from '@/assets/more.svg';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: '//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css',
  },
];

export async function loader() {
  return {}; // expenses는 각 페이지에서 개별 로드
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StopUsingIt" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0f172a" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  // useEffect(() => {
  //   // 웹뷰에서 확대/축소 방지
  //   const preventZoom = (e: TouchEvent) => {
  //     if (e.touches.length > 1) {
  //       e.preventDefault();
  //     }
  //   };

  //   // 컨텍스트 메뉴 방지
  //   const preventContextMenu = (e: MouseEvent) => {
  //     e.preventDefault();
  //   };

  //   // 더블탭 줌 방지
  //   let lastTouchEnd = 0;
  //   const preventDoubleTapZoom = (e: TouchEvent) => {
  //     const now = new Date().getTime();
  //     if (now - lastTouchEnd <= 300) {
  //       e.preventDefault();
  //     }
  //     lastTouchEnd = now;
  //   };

  //   // 키보드 단축키 방지
  //   const preventKeyboardShortcuts = (e: KeyboardEvent) => {
  //     // Ctrl/Cmd + 키 조합 방지
  //     if (
  //       (e.ctrlKey || e.metaKey) &&
  //       (e.key === '+' ||
  //         e.key === '-' ||
  //         e.key === '=' ||
  //         e.key === '0' ||
  //         e.key === '9' ||
  //         e.key === 'c' ||
  //         e.key === 'v' ||
  //         e.key === 'x' ||
  //         e.key === 'a')
  //     ) {
  //       e.preventDefault();
  //     }

  //     // F11, F12 키 방지
  //     if (e.key === 'F11' || e.key === 'F12') {
  //       e.preventDefault();
  //     }
  //   };

  //   // 이벤트 리스너 등록
  //   document.addEventListener('touchstart', preventZoom, { passive: false });
  //   document.addEventListener('touchend', preventDoubleTapZoom, {
  //     passive: false,
  //   });
  //   document.addEventListener('contextmenu', preventContextMenu);
  //   document.addEventListener('keydown', preventKeyboardShortcuts);

  //   // 스크롤 방지 (필요한 경우)
  //   const preventScroll = (e: TouchEvent) => {
  //     if (e.touches.length > 1) {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener('touchmove', preventScroll, { passive: false });

  //   // 클린업 함수
  //   return () => {
  //     document.removeEventListener('touchstart', preventZoom);
  //     document.removeEventListener('touchend', preventDoubleTapZoom);
  //     document.removeEventListener('contextmenu', preventContextMenu);
  //     document.removeEventListener('keydown', preventKeyboardShortcuts);
  //     document.removeEventListener('touchmove', preventScroll);
  //   };
  // }, []);

  return (
    <ExpenseProvider>
      <div className="app-container">
        <main className="content">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-1">
          <Link
            to="/expenses"
            className={`flex flex-col items-center py-1 px-4 ${
              location.pathname.startsWith('/expenses')
                ? 'text-black'
                : 'text-gray-500'
            }`}
          >
            <HomeIcon
              className={`w-6 h-6 mb-1 ${
                location.pathname.startsWith('/expenses')
                  ? 'text-black'
                  : 'text-gray-500'
              }`}
            />
            <span className="text-xs">홈</span>
          </Link>
          <Link
            to="/report"
            className={`flex flex-col items-center py-1 px-4 ${
              location.pathname.startsWith('/report')
                ? 'text-black'
                : 'text-gray-500'
            }`}
          >
            <ReportIcon
              className={`w-6 h-6 mb-1 ${
                location.pathname.startsWith('/report')
                  ? 'text-black'
                  : 'text-gray-500'
              }`}
            />
            <span className="text-xs">리포트</span>
          </Link>
          <Link
            to="/more"
            className={`flex flex-col items-center py-1 px-4 ${
              location.pathname.startsWith('/more')
                ? 'text-black'
                : 'text-gray-500'
            }`}
          >
            <MoreIcon
              className={`w-6 h-6 mb-1 ${
                location.pathname.startsWith('/more')
                  ? 'text-black'
                  : 'text-gray-500'
              }`}
            />
            <span className="text-xs">더보기</span>
          </Link>
        </nav>
      </div>
    </ExpenseProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
