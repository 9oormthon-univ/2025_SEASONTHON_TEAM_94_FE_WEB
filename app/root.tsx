import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { Link, useLocation } from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { fetchAllExpenses } from '@/api/nativeBridge.js';
import { ExpenseProvider } from '@/contexts/ExpenseContext';

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader() {
  const expenses = fetchAllExpenses();
  return { expenses };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
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
  const { expenses: initialExpenses } = useLoaderData();
  const location = useLocation();

  useEffect(() => {
    // 웹뷰에서 확대/축소 방지
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 컨텍스트 메뉴 방지
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 더블탭 줌 방지
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // 키보드 단축키 방지
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Ctrl/Cmd + 키 조합 방지
      if ((e.ctrlKey || e.metaKey) && (
        e.key === '+' || e.key === '-' || e.key === '=' || 
        e.key === '0' || e.key === '9' || e.key === 'c' || 
        e.key === 'v' || e.key === 'x' || e.key === 'a'
      )) {
        e.preventDefault();
      }
      
      // F11, F12 키 방지
      if (e.key === 'F11' || e.key === 'F12') {
        e.preventDefault();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    // 스크롤 방지 (필요한 경우)
    const preventScroll = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // 클린업 함수
    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  const getLinkClass = (path: string, tab?: string) => {
    const baseClass = "flex-1 text-center py-3 text-sm font-medium transition-all duration-200";
    const isActive = location.pathname === path && 
      (tab ? new URLSearchParams(location.search).get('tab') === tab : true);
    return isActive
      ? `${baseClass} text-primary bg-accent`
      : `${baseClass} text-muted-foreground hover:text-foreground`;
  };

  return (
    <ExpenseProvider initialExpenses={initialExpenses}>
      <div className="app-container">
        <main className="content">
          <Outlet />
        </main>
        <nav className="bottom-nav">
          <Link to="/expenses?tab=unclassified" className={getLinkClass("/expenses", "unclassified")}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>미분류</span>
          </Link>
          <Link to="/expenses?tab=classified" className={getLinkClass("/expenses", "classified")}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>분류</span>
          </Link>
        </nav>
      </div>
    </ExpenseProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
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
