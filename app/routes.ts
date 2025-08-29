import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('expenses', 'routes/expenses._index.tsx'),
  route('expenses/:expenseId', 'routes/expenses.$expenseId.tsx'),
  route('expenses/add', 'routes/expenses.add.tsx'),
  route('report', 'routes/report.tsx'),
] satisfies RouteConfig;
