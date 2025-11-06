export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // YYYY-MM-DD
  category?: string;
  notes?: string;
  isPaid?: boolean;
}

export interface RawTransaction {
    ID: number;
    "IMPUESTOS DEPOSITO": string | null;
    Fecha: string;
    Importe: number;
    "I.V.A": number | string | null;
    OBSERVACIONES: string | null;
    Signed: number;
    "Saldo acumulado": number;
}

export interface Section {
  name: string;
  transactions: Transaction[];
  total: number;
}