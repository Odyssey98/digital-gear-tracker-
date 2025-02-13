export type UsageStatus = 'unused' | 'inUse' | 'idle' | 'sold' | 'scrapped';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  purpose: string;
  price: number;
  status: UsageStatus;
  purchase_date: string;
  expected_lifespan: number;
  notes?: string;
  reason_to_buy?: string;
  tags?: string[];
  created_at?: string;
}

export interface DBProduct extends Omit<Product, 'purchaseDate' | 'expectedLifespan'> {
  purchase_date: string;
  expected_lifespan: number;
}

export interface User {
  id: string;
  name: string;
  products?: Product[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}