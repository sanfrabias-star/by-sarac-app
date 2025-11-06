
import React from 'react';
import { type Transaction } from '../types';

interface DataTableProps {
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
};

const formatDate = (dateString: string) => {
    try {
        return new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(dateString));
    } catch {
        return 'N/A';
    }
};

export const DataTable: React.FC<DataTableProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600 font-semibold">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4">Descripción</th>
              <th className="p-4">Categoría</th>
              <th className="p-4 text-right">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length > 0 ? (
              transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-500 whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="p-4 font-medium text-slate-800">{tx.description}</td>
                  <td className="p-4 text-slate-500">
                    <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {tx.category || 'General'}
                    </span>
                  </td>
                  <td className={`p-4 font-bold text-right ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-8 text-slate-500">
                  No se encontraron transacciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
