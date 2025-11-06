import React from 'react';
// FIX: Update User type import for Firebase v9+ modular API
import type { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
  syncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignOut, syncing }) => {
  return (
    <header className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Smart Expense Tracker
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Rastrea tus gastos inteligentemente</p>
        </div>
        
        {user && (
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            {syncing && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                Sincronizando...
              </div>
            )}
            
            <div className="flex items-center gap-3 flex-grow">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-10 h-10 rounded-full border-2 border-purple-200"
                />
              )}
              <div className="text-right flex-grow">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.displayName || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};