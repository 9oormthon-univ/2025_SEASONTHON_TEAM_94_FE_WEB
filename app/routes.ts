import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { ro } from 'date-fns/locale';

export default [
  index('routes/_index.tsx'),

  route('home', 'features/home/pages/HomePage.tsx'),
  route('auth', 'routes/auth.tsx'),
  route('auth/callback', 'routes/auth.callback.tsx'),
  route('auth/onboarding', 'routes/auth.onboarding.tsx'),

  route('expenses', 'routes/expenses._index.tsx'),
  route('expenses/:expenseId', 'routes/expenses.$expenseId.tsx'),
  route('expenses/add', 'routes/expenses.add.tsx'),

  route('calendar', 'features/calendar/pages/ExpensesCalendarPage.tsx'),
  
  route('report', 'routes/report.tsx'),

  route("more", "features/more/pages/MorePage.tsx"),
  route("reports/budget-goal", "features/reports/pages/BudgetGoalPage.tsx"),
  route("profile/nickname", "features/profile/pages/NicknamePage.tsx")
] satisfies RouteConfig;
