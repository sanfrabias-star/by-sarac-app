import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TransactionSections } from './components/TransactionSections';
import { AddTransactionModal } from './components/AddTransactionModal';
import { CreateNewMonthModal } from './components/CreateNewMonthModal';
import { SubtotalSummary } from './components/SubtotalSummary';
import { type Transaction, type Section } from './types';
import { processInitialData, createEmptyMonthData } from './utils/dataProcessor';
import { useFirebaseData } from './hooks/useFirebaseData';

const DEFAULT_MONTH = '2025-10';

interface MonthData {
  income: number;
  sections: Section[];
}

interface AppData {
  [month: string]: MonthData;
}

function AppContent() {
  const { user, loading: authLoading, signOut } = useAuth(); 
  const { data: firebaseData, loading: firebaseLoading, syncing, saveData } = useFirebaseData();
  
  const [allData, setAllData] = useState<AppData>({});
  const [currentMonth, setCurrentMonth] = useState<string>(DEFAULT_MONTH);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialDataSaved, setInitialDataSaved] = useState(false);

  // 🔹 Cargar datos iniciales desde Firebase o crear datos base
  useEffect(() => {
    if (!authLoading && !firebaseLoading) {
      if (user) {
        if (Object.keys(firebaseData).length > 0) {
          setAllData(firebaseData);
          const months = Object.keys(firebaseData).sort().reverse();
          if (months.length > 0 && !Object.keys(allData).length) {
            setCurrentMonth(months[0]);
          }
        } else if (!initialDataSaved) {
          const initialSections = processInitialData();
          const initialData: AppData = {
            [DEFAULT_MONTH]: {
              income: 0,
              sections: initialSections
            }
          };
          setAllData(initialData);
          saveData(initialData);
          setInitialDataSaved(true);
        }
      } else {
        setAllData({});
        setInitialDataSaved(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseData, firebaseLoading, user, authLoading]);

  // ✅ Sincronización optimizada con Firebase (sin loops infinitos)
  useEffect(() => {
    if (!user || authLoading || firebaseLoading) return;

    const firebaseString = JSON.stringify(firebaseData);
    const localString = JSON.stringify(allData);
    if (firebaseString === localString) return;

    const handler = setTimeout(() => {
      if (Object.keys(allData).length > 0) {
        console.log("🔄 Guardando cambios en Firestore...");
        saveData(allData);
      }
    }, 1200);

    return () => clearTimeout(handler);
  }, [allData, firebaseData, user, authLoading, firebaseLoading, saveData]);

  // 📊 Datos del mes actual
  const currentMonthData = useMemo(() => {
    return allData[currentMonth] || createEmptyMonthData(currentMonth);
  }, [allData, currentMonth]);

  const { expenses, balance } = useMemo(() => {
    const sections = currentMonthData.sections || [];
    const totalExpenses = sections.reduce((total, section) => total + section.total, 0);
    const currentIncome = currentMonthData.income || 0;
    return { expenses: totalExpenses, balance: currentIncome - totalExpenses };
  }, [currentMonthData]);

  // 💰 Actualizar ingreso mensual
  const handleIncomeChange = useCallback((newIncome: number) => {
    setAllData(prevData => ({
      ...prevData,
      [currentMonth]: {
        ...(prevData[currentMonth] || createEmptyMonthData(currentMonth)),
        income: newIncome,
      }
    }));
  }, [currentMonth]);

  // 🧾 Actualizar una transacción
  const handleTransactionUpdate = useCallback((sectionName: string, transactionId: string, updatedFields: Partial<Transaction>) => {
    setAllData(prevData => {
      const currentData = prevData[currentMonth] || createEmptyMonthData(currentMonth);
      const updatedSections = currentData.sections.map(section => {
        if (section.name === sectionName) {
          const updatedTransactions = section.transactions.map(t =>
            t.id === transactionId ? { ...t, ...updatedFields } : t
          );
          const newTotal = updatedTransactions.reduce((sum, t) => sum + t.amount, 0);
          return { ...section, transactions: updatedTransactions, total: newTotal };
        }
        return section;
      });
      return { ...prevData, [currentMonth]: { ...currentData, sections: updatedSections } };
    });
  }, [currentMonth]);

  // ❌ Eliminar transacción
  const handleTransactionDelete = useCallback((sectionName: string, transactionId: string) => {
    setAllData(prevData => {
      const currentData = prevData[currentMonth] || createEmptyMonthData(currentMonth);
      const updatedSections = currentData.sections.map(section => {
        if (section.name === sectionName) {
          const updatedTransactions = section.transactions.filter(t => t.id !== transactionId);
          const newTotal = updatedTransactions.reduce((sum, t) => sum + t.amount, 0);
          return { ...section, transactions: updatedTransactions, total: newTotal };
        }
        return section;
      });
      return { ...prevData, [currentMonth]: { ...currentData, sections: updatedSections } };
    });
  }, [currentMonth]);

  // ➕ Agregar nueva transacción
  const handleAddTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setAllData(prevData => {
      const currentData = prevData[currentMonth] || createEmptyMonthData(currentMonth);
      const newTransaction: Transaction = { ...transaction, id: `tx_${Date.now()}` };
      const updatedSections = currentData.sections.map(section => {
        if (section.name === transaction.category) {
          const updatedTransactions = [...section.transactions, newTransaction];
          const newTotal = updatedTransactions.reduce((sum, t) => sum + t.amount, 0);
          return { ...section, transactions: updatedTransactions, total: newTotal };
        }
        return section;
      });
      return { ...prevData, [currentMonth]: { ...currentData, sections: updatedSections } };
    });
    setIsAddModalOpen(false);
  }, [currentMonth]);

  // ➕ Agregar item rápido a sección
  const handleAddItemToSection = useCallback((sectionName: string) => {
    setAllData(prevData => {
      const currentData = prevData[currentMonth] || createEmptyMonthData(currentMonth);
      const newTransaction: Transaction = {
        id: `new_tx_${Date.now()}`,
        description: 'Nuevo Item',
        amount: 0,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        category: sectionName,
        notes: '',
        isPaid: false
      };
      const updatedSections = currentData.sections.map(section => {
        if (section.name === sectionName) {
          const updatedTransactions = [newTransaction, ...section.transactions];
          const newTotal = updatedTransactions.reduce((sum, t) => sum + t.amount, 0);
          return { ...section, transactions: updatedTransactions, total: newTotal };
        }
        return section;
      });
      return { ...prevData, [currentMonth]: { ...currentData, sections: updatedSections } };
    });
  }, [currentMonth]);

  const handleMonthChange = useCallback((newMonth: string) => {
    setCurrentMonth(newMonth);
  }, []);

  const handleCreateNewMonth = useCallback((newMonth: string) => {
    if (!allData[newMonth]) {
      setAllData(prevData => ({ ...prevData, [newMonth]: createEmptyMonthData(newMonth) }));
    }
    setCurrentMonth(newMonth);
    setIsCreateModalOpen(false);
  }, [allData]);

  const availableMonths = useMemo(() => Object.keys(allData).sort().reverse(), [allData]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (firebaseLoading && Object.keys(allData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando tus datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Header 
          user={user}
          onSignOut={signOut}
          syncing={syncing}
        />
        
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          {availableMonths.length > 0 && (
            <select
              value={currentMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            Nuevo Mes
          </button>
        </div>

        <SummaryCards income={currentMonthData.income} onIncomeChange={handleIncomeChange} expenses={expenses} balance={balance} />
        
        <div className="mt-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mb-6"
          >
            + Agregar Transacción
          </button>
        </div>

        <TransactionSections
          sections={currentMonthData.sections}
          onTransactionUpdate={handleTransactionUpdate}
          onTransactionDelete={handleTransactionDelete}
          onAddItemToSection={handleAddItemToSection}
        />

        <SubtotalSummary sections={currentMonthData.sections} />
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
        sections={currentMonthData.sections}
      />

      <CreateNewMonthModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNewMonth}
        existingMonths={availableMonths}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
