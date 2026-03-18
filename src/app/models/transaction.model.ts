export interface Transaction {
  id: string;
  fundId: string;
  fundName: string;
  amount: number;
  type: 'SUBSCRIBE' | 'CANCEL';
  date: string;
}
