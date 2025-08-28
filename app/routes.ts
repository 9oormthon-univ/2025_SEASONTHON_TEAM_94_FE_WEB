import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("expenses", "routes/expenses._index.tsx"),
  route("expenses/:expenseId", "routes/expenses.$expenseId.tsx")
] satisfies RouteConfig;
