export interface CustomerBill {
  id: string;
  name: string;
  amount: number;
  status: 'pending' | 'paid';
  paymentMethod?: 'transfer' | 'cash';
  notes?: string;
  due_date: Date;
  created_at: Date;
  phone_number?: string;
  address?: string;
  package_name?: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
}

export interface BillingStats {
  totalCustomers: number;
  totalPending: number;
  totalPaid: number;
  totalUnpaid: number;
  totalPaidAmount: number;
  totalRevenue: number;
}