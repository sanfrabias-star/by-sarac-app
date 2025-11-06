import React, { useState, useEffect } from 'react';
import { type Transaction } from '../types';

interface SuppliersDataTableProps {
  transactions: Transaction[];
  onUpdate: (transactionId: string, updatedFields: Partial<Transaction>) => void;
}

const formatCurrencyForInput = (amount: number) => {
    return amount.toFixed(2);
};

export const SuppliersDataTable: React.FC<SuppliersDataTableProps> = ({ transactions, onUpdate }) => {
  const [editingValues, setEditingValues] = useState<{[key: string]: {date: string, amount: string, notes: string}}>({});

  useEffect(() => {
    const initialValues: {[key: string]: {date: string, amount: string, notes: string}} = {};
    transactions.forEach(tx => {
      initialValues[tx.id] = {
        date: tx.date,
        amount: formatCurrencyForInput(tx.amount),
        notes: tx.notes || ''
      };
    });
    setEditingValues(initialValues);
  }, [transactions]);

  const handleInputChange = (id: string, field: 'date' | 'amount' | 'notes', value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleBlur = (id: string, field: 'date' | 'amount' | 'notes') => {
    const value = editingValues[id][field];
    const originalTx = transactions.find(tx => tx.id === id);

    if (!originalTx) return;

    if (field === 'amount') {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && numericValue !== originalTx.amount) {
        onUpdate(id, { amount: numericValue });
      } else {
        // Revert if invalid
        handleInputChange(id, 'amount', formatCurrencyForInput(originalTx.amount));
      }
    } else if (field === 'date') {
      if (value !== originalTx.date) {
        onUpdate(id, { date: value });
      }
    } else { // notes
      if (value !== (originalTx.notes || '')) {
          onUpdate(id, { notes: value });
      }
    }
  };

  const handleCheckboxChange = (id: string, isPaid: boolean) => {
    onUpdate(id, { isPaid });
  };

  return (
    <div className="bg-white rounded-b-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600 font-semibold">
            <tr>
              <th className="p-4 w-12 text-center">Pagado</th>
              <th className="p-4">Descripción</th>
              <th className="p-4 w-40">Fecha</th>
              <th className="p-4">Observaciones</th>
              <th className="p-4 w-48 text-right">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map(tx => (
              <tr 
                key={tx.id}
                className={`transition-colors ${tx.isPaid ? 'bg-green-50 text-slate-500' : 'hover:bg-slate-50'}`}
              >
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={!!tx.isPaid}
                    onChange={(e) => handleCheckboxChange(tx.id, e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                </td>
                <td className={`p-4 font-medium ${tx.isPaid ? 'line-through' : 'text-slate-800'}`}>{tx.description}</td>
                <td className="p-4">
                   <input
                    type="date"
                    value={editingValues[tx.id]?.date || tx.date}
                    onChange={(e) => handleInputChange(tx.id, 'date', e.target.value)}
                    onBlur={() => handleBlur(tx.id, 'date')}
                    className="w-full px-2 py-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-100"
                    disabled={tx.isPaid}
                   />
                </td>
                <td className="p-4">
                    <input
                        type="text"
                        value={editingValues[tx.id]?.notes || ''}
                        onChange={(e) => handleInputChange(tx.id, 'notes', e.target.value)}
                        onBlur={() => handleBlur(tx.id, 'notes')}
                        placeholder="Añadir nota..."
                        className="w-full px-2 py-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-100"
                        disabled={tx.isPaid}
                    />
                </td>
                <td className="p-4 text-right">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                      type="number"
                      value={editingValues[tx.id]?.amount || formatCurrencyForInput(tx.amount)}
                      onChange={(e) => handleInputChange(tx.id, 'amount', e.target.value)}
                      onBlur={() => handleBlur(tx.id, 'amount')}
                      className="w-full text-right font-semibold pr-3 pl-6 py-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-100"
                      disabled={tx.isPaid}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
