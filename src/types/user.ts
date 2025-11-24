export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'pegawai';
  employee_tagihan_table_name?: string;
  isActive: boolean;
  created_at: Date;
  lastLogin?: Date;
}

