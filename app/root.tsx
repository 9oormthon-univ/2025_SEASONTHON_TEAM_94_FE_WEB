import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { Link, useLocation } from 'react-router';
import { useEffect } from 'react';

import type { Route } from './+types/root';
import '@/app.css';
import { ExpenseProvider } from '@/features/expenses/hooks/useExpenses';

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
          <Link to="/expenses" className="flex flex-col items-center py-1 px-4">
            <svg
              className="w-6 h-6 mb-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs">홈</span>
          </Link>
          <Link to="/report" className="flex flex-col items-center py-1 px-4">
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-xs">리포트</span>
          </Link>
          <Link to="/more" className="flex flex-col items-center py-1 px-4">
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
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
