import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

interface QueryProviderProps {
  children: React.ReactNode;
}

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 - 데이터가 상하는 시간
      gcTime: 1000 * 60 * 10, // 10분 - 캐시 유지 시간
      retry: 3, // 실패 시 3번 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 갱신 비활성화
      refetchOnReconnect: true, // 네트워크 재연결 시 자동 갱신
    },
    mutations: {
      retry: 1, // 변이 실패 시 1번 재시도
      onError: (error) => {
        // 전역 에러 처리
        const message = error instanceof Error 
          ? error.message 
          : '요청 처리 중 오류가 발생했습니다.';
        toast.error(message);
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // 쿼리별 메타 정보가 있는 경우 해당 메시지 사용
      if (query.meta?.errorMessage) {
        toast.error(query.meta.errorMessage as string);
      }
    },
  }),
});

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools 
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}