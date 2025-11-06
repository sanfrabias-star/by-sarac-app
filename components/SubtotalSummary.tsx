import React from 'react';
import { type Section } from '../types';

interface SubtotalSummaryProps {
  sections: Section[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

const SummaryBlock: React.FC<{ title: string; sections: Section[] }> = ({ title, sections }) => {
  if (sections.length === 0) return null;

  const grandTotalPlanned = sections.reduce((total, section) => total + section.total, 0);

  const grandTotalPaid = sections.reduce((total, section) => {
    const sectionPaidTotal = section.transactions.reduce((sum, tx) => (tx.isPaid ? sum + tx.amount : sum), 0);
    return total + sectionPaidTotal;
  }, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <div className="flex justify-end text-xs text-slate-500 font-semibold mb-3 pr-2">
          <span className="w-28 text-right">Pagado</span>
          <span className="w-28 text-right">Planificado</span>
      </div>
      <div className="space-y-3">
        {sections.sort((a, b) => a.name.localeCompare(b.name)).map(section => {
          const sectionPaidTotal = section.transactions.reduce((sum, tx) => (tx.isPaid ? sum + tx.amount : sum), 0);
          return (
            <div key={section.name} className="flex justify-between items-center text-sm">
              <p className="text-slate-600">{section.name}</p>
              <div className="flex font-semibold text-slate-800">
                <span className="w-28 text-right text-green-600">{formatCurrency(sectionPaidTotal)}</span>
                <span className="w-28 text-right">{formatCurrency(section.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-200 mt-4 pt-4">
        <div className="flex justify-between items-center font-bold text-base">
          <p className="text-slate-900">Total</p>
          <div className="flex">
            <span className="w-28 text-right text-green-600">{formatCurrency(grandTotalPaid)}</span>
            <span className="w-28 text-right text-cyan-600">{formatCurrency(grandTotalPlanned)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SubtotalSummary: React.FC<SubtotalSummaryProps> = ({ sections }) => {
  const personalSectionNames = ["Impuestos Personales", "Gastos Personales", "Tarjetas de Crédito"];

  const officeSections = sections.filter(s => !personalSectionNames.includes(s.name));
  const personalSections = sections.filter(s => personalSectionNames.includes(s.name));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <SummaryBlock title="Resumen Gastos Oficina" sections={officeSections} />
        <SummaryBlock title="Resumen Gastos Personales" sections={personalSections} />
    </div>
  );
};