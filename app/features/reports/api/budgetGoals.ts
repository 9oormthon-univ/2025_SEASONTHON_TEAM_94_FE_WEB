// features/reports/api/budgetGoals.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';
import type {
  BudgetGoalResponse,
  BudgetGoalCreateRequest,
  BudgetGoalUpdateRequest,
} from '@/shared/types/budget';

export function createBudgetGoal(body: BudgetGoalCreateRequest) {
  return httpClient.post<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOALS,
    body
  );
}

export function getBudgetGoalById(id: number) {
  return httpClient.get<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOAL_BY_ID(id)
  );
}

export function getBudgetGoalByDate(params?: { date?: string }) {
  return httpClient.get<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOALS,
    params
  );
}

export function updateBudgetGoal(id: number, body: BudgetGoalUpdateRequest) {
  return httpClient.put<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOAL_BY_ID(id),
    body
  );
}
