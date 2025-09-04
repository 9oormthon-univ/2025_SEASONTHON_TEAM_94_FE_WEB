// shared/types/budget.ts
export interface BudgetGoalResponse {
  id: number; // int64
  price: number; // int64
  userUid: string;
  createdAt: string; // date-time format
  updatedAt: string; // date-time format
}

export interface BudgetGoalCreateRequest {
  price: number; // int64, required
}

export interface BudgetGoalUpdateRequest {
  price: number; // int64, required
}
