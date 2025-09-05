export interface Bill {
  id?: string;
  totalAmount: number;
  address: string;
  panNumber: string;
  GSTINumber: string;
  name: string;
  date: string; // ISO date string, e.g., "YYYY-MM-DD"
  createdAt?: string;
  billNumber?: string;
}
