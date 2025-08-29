import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("expenses", "routes/expenses._index.tsx"),
  route("expenses/:expenseId", "routes/expenses.$expenseId.tsx"),
  route("report", "routes/report.tsx"),
  route("more", "features/more/pages/MorePage.tsx")
] satisfies RouteConfig;
