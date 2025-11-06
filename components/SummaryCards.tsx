import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpCircleIcon, ArrowDownCircleIcon, BanknotesIcon, PencilIcon } from './Icons';

interface SummaryCardsProps {
  income: number;
  onIncomeChange: (newIncome: number) => void;
  expenses: number;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; colorClass: string }> = ({ title, amount, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
        <div className={`p-2 rounded-full ${colorClass}`}>
           {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(amount)}</p>
        </div>
    </div>
);

const EditableSummaryCard: React.FC<{ title: string; amount: number; onAmountChange: (newAmount: number) => void; icon: React.ReactNode; colorClass: string }> = ({ title, amount, onAmountChange, icon, colorClass }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(String(amount));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isEditing) {
          setValue(String(amount));
        }
    }, [amount, isEditing]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        const newAmount = parseFloat(value);
        if (!isNaN(newAmount)) {
            onAmountChange(newAmount);
        } else {
            setValue(String(amount)); // revert if invalid
        }
        setIsEditing(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setValue(String(amount));
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className={`p-2 rounded-full ${colorClass}`}>
               {icon}
            </div>
            <div className="w-full">
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                {isEditing ? (
                     <div className="relative mt-1">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 text-2xl font-bold">$</span>
                        <input
                            ref={inputRef}
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="w-full text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-cyan-500 focus:outline-none pl-5"
                        />
                    </div>
                ) : (
                    <div onClick={() => setIsEditing(true)} className="group flex items-center gap-2 cursor-pointer">
                        <p className="text-2xl font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                            {formatCurrency(amount)}
                        </p>
                        <PencilIcon className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        </div>
    );
  };


export const SummaryCards: React.FC<SummaryCardsProps> = ({ income, onIncomeChange, expenses, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EditableSummaryCard 
        title="Total Ingresos"
        amount={income}
        onAmountChange={onIncomeChange}
        icon={<ArrowUpCircleIcon className="text-green-800" />}
        colorClass="bg-green-100"
      />
      <SummaryCard 
        title="Total Egresos"
        amount={expenses}
        icon={<ArrowDownCircleIcon className="text-red-800" />}
        colorClass="bg-red-100"
      />
      <SummaryCard 
        title="Balance Actual"
        amount={balance}
        icon={<BanknotesIcon className="text-cyan-800" />}
        colorClass="bg-cyan-100"
      />
    </div>
  );
};