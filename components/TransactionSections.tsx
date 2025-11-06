import React from 'react';
import { type Section, type Transaction } from '../types';
import { SectionItem } from './SectionItem';

interface TransactionSectionsProps {
  sections: Section[];
  onTransactionUpdate: (sectionName: string, transactionId: string, updatedFields: Partial<Transaction>) => void;
  onAddItemToSection: (sectionName: string) => void;
}

export const TransactionSections: React.FC<TransactionSectionsProps> = ({ sections, onTransactionUpdate, onAddItemToSection }) => {
  if (sections.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
        <p className="text-slate-500">No se encontraron transacciones para el filtro actual.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <SectionItem 
          key={section.name} 
          section={section} 
          defaultOpen={index === 0}
          onTransactionUpdate={onTransactionUpdate}
          onAddItem={onAddItemToSection}
        />
      ))}
    </div>
  );
};