import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';

export type BudgetGoal = {
  id: number;
  price: number;
  userUid: string;
  createdAt: string;
  updatedAt: string;
};

export function getBudgetGoalById(
  id: number,
  params?: { userUid?: string }   // ✅ 추가
) {
  return httpClient.get<ApiResponse<BudgetGoal>>(
    API_ENDPOINTS.BUDGET_GOAL_BY_ID(id),
    params                                 // ✅ 전달
  );
}

export function listBudgetGoals(userUid: string) {
  return httpClient.get<ApiResponse<BudgetGoal[]>>(
    API_ENDPOINTS.BUDGET_GOALS,
    { userUid }
  );
}
