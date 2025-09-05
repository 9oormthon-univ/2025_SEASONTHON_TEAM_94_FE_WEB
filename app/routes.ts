import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  // 루트 라우트
  index('routes/_index.tsx'),

  // 인증 관련 페이지들 (바텀 탭 없음)
  route('auth', 'routes/auth.tsx'),
  route('auth/callback', 'routes/auth.callback.tsx'),
  route('auth/onboarding', 'routes/auth.onboarding.tsx'),

  // 지출 관련 페이지
  route('expenses', 'routes/expenses._index.tsx'),
  route('expenses/:expenseId', 'routes/expenses.$expenseId.tsx'),
  route('expenses/add', 'routes/expenses.add.tsx'),
  route('expenses/unclassified', 'routes/expenses.unclassified.tsx'),
  route('expenses/fixed', 'routes/expenses.fixed.tsx'),
  route('expenses/over', 'routes/expenses.over.tsx'),

  // 바텀 탭에서 이동 가능한 페이지들
  route('report', 'routes/report.tsx'),
  route('home', 'features/home/pages/HomePage.tsx'),
  route('calendar', 'features/calendar/pages/ExpensesCalendarPage.tsx'),
  
  route('profile', 'routes/profile.tsx'),
  route("reports/budget-goal", "features/reports/pages/BudgetGoalPage.tsx"),
  route("profile/nickname", "features/profile/pages/NicknamePage.tsx")
] satisfies RouteConfig;
