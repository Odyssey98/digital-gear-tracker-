export type Currency = 'CNY' | 'USD' | 'EUR';
export type UsageStatus = '未开封' | '在用' | '闲置' | '已出售' | '已报废';

export interface Product {
  id: string;
  name: string;
  category: string;
  purpose: string;
  price: number;
  currency: Currency;
  status: UsageStatus;
  purchaseDate: string;
  expectedLifespan: number;
  notes?: string;
  reasonToBuy?: string;
  tags?: string[];
}

export interface User {
  id: string;
  username: string;
  products?: Product[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}