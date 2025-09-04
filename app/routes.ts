import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  // 루트 라우트
  index('routes/_index.tsx'),

  // 인증 관련 페이지들 (바텀 탭 없음)
  route('auth', 'routes/auth.tsx'),
  route('auth/callback', 'routes/auth.callback.tsx'),
  route('auth/onboarding', 'routes/auth.onboarding.tsx'),

  // 바텀 탭이 있는 페이지들 - 기존 경로 유지
  route('expenses', 'routes/expenses._index.tsx'),
  route('expenses/:expenseId', 'routes/expenses.$expenseId.tsx'),
  route('expenses/add', 'routes/expenses.add.tsx'),
  route('report', 'routes/report.tsx'),
  route('more', 'features/more/pages/MorePage.tsx'),

  route('home', 'features/home/pages/HomePage.tsx'),
  route('calendar', 'features/calendar/pages/ExpensesCalendarPage.tsx'),

  // 기타 독립적인 페이지들 (바텀 탭 없음)
  route('reports/budget-goal', 'features/reports/pages/BudgetGoalPage.tsx'),
  route('profile/nickname', 'features/profile/pages/NicknamePage.tsx'),
  
  // 지출 타입별 페이지들
  route('expenses/unclassified', 'routes/expenses.unclassified.tsx'),
  route('expenses/fixed', 'routes/expenses.fixed.tsx'),
  route('expenses/over', 'routes/expenses.over.tsx')
] satisfies RouteConfig;
