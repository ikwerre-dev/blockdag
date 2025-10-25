export interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  activeUsers: number;
}

export interface RecentUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface RecentTransaction {
  id: number;
  amount: number;
  currency: string;
  sender_id?: number;
  recipient_id?: number;
  sender?: string;
  recipient?: string;
  created_at: string;
  status: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: RecentUser[];
  recentTransactions: RecentTransaction[];
}


export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  p2p_code: string;
  is_verified: boolean;
  created_at: string;
  wallets?: Wallet[];
}

export interface Wallet {
  id: number;
  currency: string;
  balance: number;
}