import React, { useState, useMemo } from 'react';
import { type Section, type Transaction } from '../types';
import { SuppliersDataTable } from './SuppliersDataTable';
import { ChevronDownIcon, PlusIcon } from './Icons';

interface SectionItemProps {
  section: Section;
  defaultOpen?: boolean;
  onTransactionUpdate: (sectionName: string, transactionId: string, updatedFields: Partial<Transaction>) => void;
  onTransactionDelete: (sectionName: string, transactionId: string) => void;
  onAddItem: (sectionName: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  defaultOpen = false,
  onTransactionUpdate,
  onTransactionDelete,
  onAddItem
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const paidTotal = useMemo(() => {
    return section.transactions.reduce((sum, tx) => (tx.isPaid ? sum + tx.amount : sum), 0);
  }, [section.transactions]);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50 cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">{section.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
              {section.transactions.length} {section.transactions.length === 1 ? 'item' : 'items'}
            </span>
            {/* Botón separado del contenedor principal */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddItem(section.name);
              }}
              className="flex items-center justify-center w-6 h-6 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 hover:text-slate-800 transition-colors"
              aria-label={`Añadir item a ${section.name}`}
              type="button"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm font-semibold text-green-600">{formatCurrency(paidTotal)} Pagado</span>
            <span className="text-xs text-slate-500"> / {formatCurrency(section.total)}</span>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100">
          <SuppliersDataTable
            transactions={section.transactions}
            onUpdate={(transactionId, updatedFields) =>
              onTransactionUpdate(section.name, transactionId, updatedFields)
            }
            onDelete={(transactionId) => onTransactionDelete(section.name, transactionId)}
          />
        </div>
      )}
    </div>
  );
};
