/**
 * @file Header.tsx
 * Encabezado de Trueque Escolar adaptado a lectura bajo luz solar y texto >= 16px.
 * 
 * Botones secundarios en el header para preservar un único botón principal por pantalla.
 */

import React from 'react';
import { ArrowLeftRight, Plus, Download } from 'lucide-react';

interface HeaderProps {
  onAbrirPublicar: () => void;
  onExportarJSON: () => void;
  formularioAbierto: boolean;
  totalObjetos: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAbrirPublicar, 
  onExportarJSON, 
  formularioAbierto,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-slate-300 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        {/* Logo y título con alto contraste y texto >= 16px */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ArrowLeftRight className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight truncate">
              Trueque Escolar
            </h1>
            <p className="text-base text-slate-700 font-semibold truncate">
              Intercambios en el instituto
            </p>
          </div>
        </div>

        {/* Botones secundarios (para cumplir con un solo botón principal por pantalla) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportarJSON}
            title="Descargar copia de respaldo"
            className="min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl border-2 border-slate-400 bg-white hover:bg-slate-100 text-slate-900 text-base font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-5 h-5 text-slate-700 shrink-0" />
            <span className="hidden sm:inline">Guardar copia</span>
          </button>

          <button
            type="button"
            onClick={onAbrirPublicar}
            className={`min-h-[48px] px-4 py-2.5 rounded-xl border-2 text-base font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-2 ${
              formularioAbierto
                ? 'border-slate-400 bg-slate-100 text-slate-900'
                : 'border-slate-800 bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>{formularioAbierto ? 'Cerrar' : 'Publicar'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
