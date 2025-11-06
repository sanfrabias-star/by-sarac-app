import { type Transaction } from "../types";

export async function parseTransactionFromText(text: string): Promise<Omit<Transaction, 'id' | 'category' | 'notes'> | null> {
  // Gemini API deshabilitada temporalmente
  console.log("Gemini API not configured");
  return null;
}