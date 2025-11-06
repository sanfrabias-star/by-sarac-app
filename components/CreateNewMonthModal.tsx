import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from './Icons';

interface CreateNewMonthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (month: string) => { error: string | null };
}

export const CreateNewMonthModal: React.FC<CreateNewMonthModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [monthValue, setMonthValue] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const { error: createError } = onCreate(monthValue);
        if (createError) {
            setError(createError);
        } else {
            // On success, the parent will close the modal. Reset local state here.
            setMonthValue('');
            setError('');
        }
    };
    
    const handleClose = () => {
        setMonthValue('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={handleClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative">
                    <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <XMarkIcon />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Mes</h2>
                    <p className="text-sm text-slate-500 mt-1">Ingresa el mes y año para crear una nueva planilla.</p>
                </div>
                <div className="p-6">
                    <label htmlFor="month-input" className="block text-sm font-medium text-slate-700 mb-2">Formato YYYY-MM</label>
                    <input
                        id="month-input"
                        type="text"
                        value={monthValue}
                        onChange={(e) => setMonthValue(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleSubmit(); }}
                        placeholder="ej: 2025-11"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>
                <div className="bg-slate-50 p-4 flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={handleClose} className="py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2">
                        <PlusIcon /> Crear
                    </button>
                </div>
            </div>
        </div>
    );
};
