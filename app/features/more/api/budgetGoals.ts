// src/api/budgetGoals.ts
import { get } from './index';

export type BudgetGoal = {
  id: number;
  price: number;
  userUid: string;
  createdAt: string;
  updatedAt: string;
};

export function getBudgetGoalById(id: number, signal?: AbortSignal) {
  return get<BudgetGoal>(`/api/v1/budgetgoals/${id}`, undefined, signal);
}

// 목록이 있을 경우(없으면 사용 안 해도 됨)
export function listBudgetGoals(userUid: string, signal?: AbortSignal) {
  return get<BudgetGoal[]>(`/api/v1/budgetgoals`, { userUid }, signal);
}
