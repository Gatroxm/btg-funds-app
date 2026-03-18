export interface Fund {
  id: string;
  name: string;
  minAmount: number;
  category: 'FPV' | 'FIC';
  profitability: number;
}
