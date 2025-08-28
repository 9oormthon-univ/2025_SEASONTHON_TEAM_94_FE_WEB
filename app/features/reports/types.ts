export type TxType = 'OVER_EXPENSE' | 'FIXED_EXPENSE' | 'NONE';

export interface TransactionResponse {
  id: number;
  price: number;
  title: string;
  type: TxType;
  userUid: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  startAt?: string;
}

export interface ApiList<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data?: T;
}
