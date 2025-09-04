import React, { Component, type ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';

interface ExpenseErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ExpenseErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 지출 관련 컴포넌트들을 위한 에러 바운더리
 * 예상치 못한 에러가 발생했을 때 사용자에게 친화적인 에러 화면을 제공합니다.
 */
export class ExpenseErrorBoundary extends Component<
  ExpenseErrorBoundaryProps,
  ExpenseErrorBoundaryState
> {
  constructor(props: ExpenseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ExpenseErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Expense Error Boundary:', error, errorInfo);

    // 에러 로깅 서비스에 전송 (예: Sentry, LogRocket 등)
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 화면
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-900">
            오류가 발생했습니다
          </h3>

          <p className="text-gray-600 mb-6 max-w-md">
            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>

          <div className="flex gap-3">
            <Button
              onClick={this.handleRetry}
              className="bg-main-orange hover:bg-main-orange/90 text-white"
            >
              다시 시도
            </Button>

            <Button variant="outline" onClick={() => window.location.reload()}>
              페이지 새로고침
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 지출 목록을 위한 특화된 에러 바운더리
 */
export function ExpenseListErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ExpenseErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2 text-gray-900">
            지출 목록을 불러올 수 없습니다
          </h3>

          <p className="text-gray-600 mb-4 text-sm">
            잠시 후 다시 시도해주세요.
          </p>

          <Button
            onClick={() => window.location.reload()}
            className="bg-main-orange hover:bg-main-orange/90 text-white"
          >
            새로고침
          </Button>
        </div>
      }
    >
      {children}
    </ExpenseErrorBoundary>
  );
}

/**
 * 지출 폼을 위한 특화된 에러 바운더리
 */
export function ExpenseFormErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ExpenseErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
          <div className="mb-4">
            <div className="w-10 h-10 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-base font-bold mb-2 text-gray-900">
            폼을 불러올 수 없습니다
          </h3>

          <p className="text-gray-600 mb-4 text-sm">
            페이지를 새로고침해주세요.
          </p>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            새로고침
          </Button>
        </div>
      }
    >
      {children}
    </ExpenseErrorBoundary>
  );
}
