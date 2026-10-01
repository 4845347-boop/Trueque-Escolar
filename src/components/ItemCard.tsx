/**
 * @file ItemCard.tsx
 * Tarjeta individual optimizada para lectura en exteriores y pantallas desde 320px.
 * Todos los textos tienen un tamaño mínimo de 16px y alto contraste.
 */

import React from 'react';
import { ObjetoTrueque, EstadoTrueque } from '../types';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  UserCircle2, 
  Tag, 
  Repeat
} from 'lucide-react';

interface ItemCardProps {
  objeto: ObjetoTrueque;
  onCambiarEstado: (id: string, nuevoEstado: EstadoTrueque) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ objeto, onCambiarEstado }) => {
  // Configuración de estados con contrastes intensos para luz solar
  const estilosPorEstado: Record<EstadoTrueque, {
    label: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    icon: React.ReactNode;
  }> = {
    disponible: {
      label: 'Disponible',
      badgeBg: 'bg-emerald-800 text-white border-emerald-950',
      badgeText: 'text-white',
      border: 'border-emerald-600 bg-white',
      icon: <CheckCircle2 className="w-5 h-5 shrink-0" />
    },
    en_proceso: {
      label: 'En proceso',
      badgeBg: 'bg-amber-400 text-amber-950 border-amber-600',
      badgeText: 'text-amber-950',
      border: 'border-amber-500 bg-amber-50/30',
      icon: <Clock className="w-5 h-5 shrink-0" />
    },
    intercambiado: {
      label: 'Intercambiado',
      badgeBg: 'bg-slate-700 text-white border-slate-900',
      badgeText: 'text-white',
      border: 'border-slate-400 bg-slate-100/60 opacity-90',
      icon: <ArrowLeftRight className="w-5 h-5 shrink-0" />
    }
  };

  const estiloActual = estilosPorEstado[objeto.estado];

  return (
    <article
      className={`rounded-2xl p-4 sm:p-5 border-2 shadow-sm transition-all duration-200 flex flex-col justify-between ${estiloActual.border}`}
    >
      <div>
        {/* Cabecera de la tarjeta: Categoría y Estado */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-base font-bold text-slate-900 bg-slate-200 px-3 py-1 rounded-lg border border-slate-300">
            <Tag className="w-4 h-4 text-slate-700" />
            {objeto.categoria}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 text-base font-extrabold px-3 py-1 rounded-lg border-2 ${estiloActual.badgeBg}`}
          >
            {estiloActual.icon}
            {estiloActual.label}
          </span>
        </div>

        {/* Nombre del objeto (mínimo 18-20px) */}
        <h3 className="font-extrabold text-lg sm:text-xl text-slate-950 leading-snug mb-3">
          {objeto.nombre}
        </h3>

        {/* Descripción (mínimo 16px) */}
        {objeto.descripcion && (
          <p className="text-base text-slate-800 font-medium leading-relaxed mb-4">
            {objeto.descripcion}
          </p>
        )}

        {/* Sección destacada: QUÉ BUSCA A CAMBIO con etiqueta visible */}
        <div className="rounded-xl bg-emerald-50 border-2 border-emerald-600 p-3.5 mb-3">
          <div className="flex items-center gap-2 text-base font-black text-emerald-950 mb-1">
            <Repeat className="w-5 h-5 text-emerald-800 shrink-0 stroke-[2.5]" />
            <span>Busca a cambio:</span>
          </div>
          <p className="text-base font-bold text-emerald-950 leading-normal">
            {objeto.queBusca}
          </p>
        </div>

        {/* Sección de Contacto del alumno con etiqueta visible */}
        <div className="rounded-xl bg-slate-100 border-2 border-slate-400 p-3 mb-3 flex items-center gap-2.5">
          <UserCircle2 className="w-5 h-5 text-slate-800 shrink-0" />
          <div className="text-base">
            <span className="font-extrabold text-slate-900">Contacto: </span>
            <span className="text-slate-900 font-bold">{objeto.contacto || objeto.contactoOpcional || 'En el instituto'}</span>
          </div>
        </div>

        {/* Fecha de publicación */}
        <div className="text-base text-slate-700 font-semibold mb-3 px-0.5">
          <span>Publicado: {objeto.fechaPublicacion}</span>
        </div>
      </div>

      {/* Control de cambio de estado con etiqueta visible y selector táctil >= 48px */}
      <div className="mt-2 pt-3 border-t-2 border-slate-200">
        <label 
          htmlFor={`estado-${objeto.id}`}
          className="block text-base font-black text-slate-900 uppercase tracking-wide mb-2"
        >
          Estado actual del objeto:
        </label>
        
        <select
          id={`estado-${objeto.id}`}
          value={objeto.estado}
          onChange={(e) => {
            const nuevoValor = e.target.value as EstadoTrueque;
            onCambiarEstado(objeto.id, nuevoValor);
          }}
          className="min-h-[48px] w-full bg-white border-2 border-slate-700 text-slate-950 text-base rounded-xl py-3 px-3.5 focus:outline-none focus:ring-4 focus:ring-emerald-700/30 font-bold cursor-pointer transition-colors shadow-2xs"
        >
          <option value="disponible">🟢 Disponible para trueque</option>
          <option value="en_proceso">🟡 En proceso de intercambio</option>
          <option value="intercambiado">⚪ Intercambiado con éxito</option>
        </select>
      </div>
    </article>
  );
};
