export type Role = 'VIEWER' | 'ANALYST' | 'ADMIN';
export type Status = 'ACTIVE' | 'INACTIVE';
export type RecordType = 'INCOME' | 'EXPENSE';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: Role;
  status: Status;
}

export interface FinancialRecord {
  id: number;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  created_by: number;
}
