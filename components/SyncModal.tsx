
import React from 'react';
import { XMarkIcon } from './Icons';

interface SyncModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <XMarkIcon />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">Sincronización</h2>
                    <p className="text-sm text-slate-500 mt-1">Esta funcionalidad no está implementada aún.</p>
                </div>
                <div className="bg-slate-50 p-4 flex justify-end rounded-b-2xl">
                    <button onClick={onClose} className="py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cerrar</button>
                </div>
            </div>
        </div>
    );
};
