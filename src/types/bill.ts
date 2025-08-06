export interface Bill {
  id: number;
  billNumber: string;
  amount: number;
  customerName: string;
  date: string; // ISO date string, e.g., "YYYY-MM-DD"
}
