
export type UsageStatus = 
  | '未开封' 
  | '在用' 
  | '闲置' 
  | '已出售' 
  | '已报废'
  | 'Unused'
  | 'In Use'
  | 'Idle'
  | 'Sold'
  | 'Scrapped';

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