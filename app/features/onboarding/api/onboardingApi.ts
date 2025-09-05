import { httpClient } from '@/shared/utils/httpClient';
import type { ApiResponse } from '@/shared/types/api';
import type { UserUpdateRequest, UserResponse } from '@/shared/types/user';
import type {
  BudgetGoalCreateRequest,
  BudgetGoalResponse,
} from '@/shared/types/budget';

/**
 * 사용자 닉네임 업데이트
 * PUT /api/v1/users
 */
export async function updateUserNickname(
  request: UserUpdateRequest
): Promise<ApiResponse<UserResponse>> {
  return httpClient.put('/api/v1/users', request);
}

/**
 * 목표 초과지출 내역 생성
 * POST /api/v1/budgetgoals
 */
export async function createBudgetGoal(
  request: BudgetGoalCreateRequest
): Promise<ApiResponse<BudgetGoalResponse>> {
  return httpClient.post('/api/v1/budgetgoals', request);
}

/**
 * 목표 초과지출 내역 조회 (날짜별)
 * GET /api/v1/budgetgoals?date={date}
 */
export async function getBudgetGoalByDate(
  date?: string
): Promise<ApiResponse<BudgetGoalResponse>> {
  const url = date ? `/api/v1/budgetgoals?date=${date}` : '/api/v1/budgetgoals';
  return httpClient.get(url);
}

/**
 * 목표 초과지출 내역 상세 조회
 * GET /api/v1/budgetgoals/{id}
 */
export async function getBudgetGoalById(
  id: number
): Promise<ApiResponse<BudgetGoalResponse>> {
  return httpClient.get(`/api/v1/budgetgoals/${id}`);
}

/**
 * 목표 초과지출 내역 수정
 * PUT /api/v1/budgetgoals/{id}
 */
export async function updateBudgetGoal(
  id: number,
  request: { price: number }
): Promise<ApiResponse<BudgetGoalResponse>> {
  return httpClient.put(`/api/v1/budgetgoals/${id}`, request);
}
