// Swagger 스펙에 맞는 사용자 관련 타입 정의

// 사용자 응답 타입 (Swagger 스펙: UserResponse)
export interface UserResponse {
  id: string;
  role: string;
  username: string;
  nickname: string;
  email: string; // 새로 추가된 필드
}

// 사용자 업데이트 요청 타입 (Swagger 스펙: UserUpdateRequest)
export interface UserUpdateRequest {
  nickname: string; // required
}
