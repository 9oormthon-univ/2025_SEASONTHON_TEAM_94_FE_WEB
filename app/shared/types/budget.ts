// shared/types/budget.ts
export interface BudgetGoalResponse {
  id: number;
  price: number;
  userUid: string;
  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime
}

export interface BudgetGoalCreateRequest {
  price: number;
  userUid: string;
}

export interface BudgetGoalUpdateRequest {
  price: number;
}
