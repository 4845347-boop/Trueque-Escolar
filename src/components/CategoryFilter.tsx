/**
 * @file CategoryFilter.tsx
 * Selector de categorías de alto contraste para visibilidad bajo la luz del sol.
 * Texto no menor a 16px y botones táctiles amplios (>= 48px de alto).
 */

import React from 'react';
import { CategoriaObjeto } from '../types';
import { BookOpen, Shirt, PencilRuler, PackageCheck, Layers } from 'lucide-react';

export type FiltroCategoria = 'Todas' | CategoriaObjeto;

interface CategoryFilterProps {
  categoriaSeleccionada: FiltroCategoria;
  onSeleccionarCategoria: (categoria: FiltroCategoria) => void;
  conteoPorCategoria: Record<FiltroCategoria, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoriaSeleccionada,
  onSeleccionarCategoria,
  conteoPorCategoria,
}) => {
  const categorias: { id: FiltroCategoria; label: string; icon: React.ReactNode }[] = [
    { id: 'Todas', label: 'Todos', icon: <Layers className="w-5 h-5 shrink-0" /> },
    { id: 'Libros', label: 'Libros', icon: <BookOpen className="w-5 h-5 shrink-0" /> },
    { id: 'Uniformes', label: 'Uniformes', icon: <Shirt className="w-5 h-5 shrink-0" /> },
    { id: 'Útiles', label: 'Útiles', icon: <PencilRuler className="w-5 h-5 shrink-0" /> },
    { id: 'Otros', label: 'Otros', icon: <PackageCheck className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <label 
          htmlFor="selector-categoria-label"
          id="selector-categoria-label"
          className="text-base font-extrabold tracking-wide text-slate-900 uppercase"
        >
          Categorías para buscar:
        </label>
        <span className="text-base text-slate-800 font-bold bg-slate-200 px-3 py-1 rounded-full">
          {conteoPorCategoria[categoriaSeleccionada] || 0} en lista
        </span>
      </div>

      {/* Botones secundarios horizontales con altura mínima de 48px y texto >= 16px */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
        {categorias.map((cat) => {
          const estaActivo = categoriaSeleccionada === cat.id;
          const cantidad = conteoPorCategoria[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSeleccionarCategoria(cat.id)}
              type="button"
              className={`min-h-[48px] flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base font-bold whitespace-nowrap transition-all border-2 cursor-pointer select-none active:scale-95 ${
                estaActivo
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-400 hover:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-base px-2 py-0.5 rounded-full font-black ${
                  estaActivo
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-900'
                }`}
              >
                {cantidad}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
