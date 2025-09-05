// features/reports/api/budgetGoals.ts
import { httpClient } from '@/shared/utils/httpClient';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { ApiResponse } from '@/shared/types/api';
import type {
  BudgetGoalResponse,
  BudgetGoalCreateRequest,
  BudgetGoalUpdateRequest,
} from '@/shared/types/budget';

// 1) 생성
export function createBudgetGoal(body: BudgetGoalCreateRequest) {
  return httpClient.post<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOALS,
    body
  );
}

// 2) 단건 조회 (id)
export function getBudgetGoalById(id: number) {
  return httpClient.get<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOAL_BY_ID(id)
  );
}

// 3) 날짜 기준 최근 데이터(해당 월) — 단건 반환
export function getBudgetGoalByDate(params?: { date?: string }) {
  return httpClient.get<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOALS,
    params
  );
}

// 4) 수정
export function updateBudgetGoal(id: number, body: BudgetGoalUpdateRequest) {
  return httpClient.put<ApiResponse<BudgetGoalResponse>>(
    API_ENDPOINTS.BUDGET_GOAL_BY_ID(id),
    body
  );
}
