export interface JWTPayload {
  uid: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserAuthData {
  uid: string;
  username: string;
}

export interface NativeBridgeMessage {
  type: 'AUTH_SUCCESS';
  data: UserAuthData;
}
