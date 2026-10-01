/**
 * @file PublishSection.tsx
 * Sección desplegable para publicar objetos escolares.
 * - Sin etiquetas <form> para evitar recargas en iframes.
 * - Etiquetas visibles en todos los campos.
 * - Textos nunca menores a 16px (text-base) y alto contraste para exteriores.
 * - Un único botón principal destacado.
 */

import React, { useState } from 'react';
import { CategoriaObjeto, ObjetoTrueque } from '../types';
import { PlusCircle, ChevronUp, ChevronDown, AlertCircle, Sparkles } from 'lucide-react';

interface PublishSectionProps {
  estaAbierto: boolean;
  onAlternar: () => void;
  onPublicar: (nuevoObjeto: Omit<ObjetoTrueque, 'id' | 'fechaPublicacion' | 'estado'>) => boolean;
}

export const PublishSection: React.FC<PublishSectionProps> = ({
  estaAbierto,
  onAlternar,
  onPublicar,
}) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<CategoriaObjeto>('Libros');
  const [queBusca, setQueBusca] = useState('');
  const [contacto, setContacto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const handleGuardar = () => {
    // Validaciones en español claro, sin tecnicismos
    if (!nombre.trim()) {
      setErrorValidacion('Por favor escribí el nombre del objeto para que tus compañeros sepan qué ofrecés.');
      return;
    }
    if (!queBusca.trim()) {
      setErrorValidacion('Por favor indicá qué objeto o útil te gustaría recibir a cambio.');
      return;
    }
    if (!contacto.trim()) {
      setErrorValidacion('Por favor indicá tu contacto (tu nombre, curso o WhatsApp) para coordinar.');
      return;
    }

    setErrorValidacion(null);

    const guardadoExitoso = onPublicar({
      nombre: nombre.trim(),
      categoria,
      queBusca: queBusca.trim(),
      contacto: contacto.trim(),
      descripcion: descripcion.trim() || undefined,
    });

    if (guardadoExitoso) {
      setNombre('');
      setQueBusca('');
      setContacto('');
      setDescripcion('');
      setCategoria('Libros');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGuardar();
    }
  };

  return (
    <section className="bg-white rounded-2xl border-2 border-slate-400 shadow-sm mb-6 overflow-hidden">
      {/* Botón de acordeón accesible de mínimo 48px de alto */}
      <div 
        onClick={onAlternar}
        className="w-full min-h-[56px] px-4 sm:px-6 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 select-none border-b-2 border-transparent data-[abierto=true]:border-slate-300"
        data-abierto={estaAbierto}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-950 leading-snug">
                Publicar un nuevo objeto para trueque
              </h2>
            </div>
            <p className="text-base text-slate-700 font-semibold mt-0.5">
              {estaAbierto 
                ? 'Completá los campos y presioná el botón verde para publicar'
                : 'Tocá acá para ofrecer un libro, uniforme o útil que ya no uses'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAlternar();
          }}
          className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl border-2 border-slate-300 text-slate-800 hover:bg-slate-200 cursor-pointer shrink-0"
          aria-label={estaAbierto ? 'Ocultar formulario' : 'Mostrar formulario'}
        >
          {estaAbierto ? <ChevronUp className="w-6 h-6 stroke-[2.5]" /> : <ChevronDown className="w-6 h-6 stroke-[2.5]" />}
        </button>
      </div>

      {/* Contenedor sin <form> con etiquetas visibles en todos los campos */}
      {estaAbierto && (
        <div className="p-4 sm:p-6 bg-slate-50 border-t-2 border-slate-300">
          {errorValidacion && (
            <div className="mb-5 flex items-start gap-3 p-4 text-base font-bold text-rose-950 bg-rose-100 border-2 border-rose-400 rounded-xl">
              <AlertCircle className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
              <span>{errorValidacion}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            {/* Campo 1: Nombre */}
            <div>
              <label 
                htmlFor="nombre-input-visible" 
                className="block text-base font-black text-slate-950 uppercase tracking-wide mb-1.5"
              >
                1. Nombre del objeto a intercambiar: <span className="text-rose-700 font-bold">*</span>
              </label>
              <input
                id="nombre-input-visible"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ejemplo: Manual de Geografía 3.° año"
                className="min-h-[50px] w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-500 bg-white text-slate-950 placeholder:text-slate-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/20 outline-none"
              />
            </div>

            {/* Campo 2: Categoría */}
            <div>
              <label 
                htmlFor="categoria-select-visible" 
                className="block text-base font-black text-slate-950 uppercase tracking-wide mb-1.5"
              >
                2. Categoría escolar: <span className="text-rose-700 font-bold">*</span>
              </label>
              <select
                id="categoria-select-visible"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaObjeto)}
                className="min-h-[50px] w-full text-base font-bold px-4 py-3 rounded-xl border-2 border-slate-500 bg-white text-slate-950 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/20 outline-none cursor-pointer"
              >
                <option value="Libros">Libros (Manuales, cuentos, guías de estudio)</option>
                <option value="Uniformes">Uniformes (Chombas, pantalones, polleras, camperas)</option>
                <option value="Útiles">Útiles (Calculadoras, reglas técnicas, compás, cartucheras)</option>
                <option value="Otros">Otros (Mochilas, carpetas de dibujo, materiales de taller)</option>
              </select>
            </div>

            {/* Campo 3: Qué busca a cambio */}
            <div>
              <label 
                htmlFor="que-busca-input-visible" 
                className="block text-base font-black text-slate-950 uppercase tracking-wide mb-1.5"
              >
                3. ¿Qué buscás o necesitás a cambio?: <span className="text-rose-700 font-bold">*</span>
              </label>
              <input
                id="que-busca-input-visible"
                type="text"
                value={queBusca}
                onChange={(e) => setQueBusca(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ejemplo: Libro de Física de 4.° año o campera de abrigo talle L"
                className="min-h-[50px] w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-500 bg-white text-slate-950 placeholder:text-slate-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/20 outline-none"
              />
            </div>

            {/* Campo 4: Contacto */}
            <div>
              <label 
                htmlFor="contacto-input-visible" 
                className="block text-base font-black text-slate-950 uppercase tracking-wide mb-1.5"
              >
                4. Tu curso o contacto en el instituto: <span className="text-rose-700 font-bold">*</span>
              </label>
              <input
                id="contacto-input-visible"
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ejemplo: Tomás de 4.° 2.ª Turno Tarde o WhatsApp"
                className="min-h-[50px] w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-500 bg-white text-slate-950 placeholder:text-slate-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/20 outline-none"
              />
            </div>

            {/* Campo 5: Descripción opcional con etiqueta visible */}
            <div>
              <label 
                htmlFor="descripcion-textarea-visible" 
                className="block text-base font-black text-slate-950 uppercase tracking-wide mb-1.5"
              >
                5. Detalles del estado del objeto: <span className="text-slate-600 font-normal normal-case">(Opcional)</span>
              </label>
              <textarea
                id="descripcion-textarea-visible"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ejemplo: Hojas completas, sin roturas, talle holgado..."
                className="w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-500 bg-white text-slate-950 placeholder:text-slate-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/20 outline-none resize-none"
              />
            </div>
          </div>

          {/* Botones de acción: UN SOLO BOTÓN PRINCIPAL (destacado en verde) y el resto secundario */}
          <div className="mt-6 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t-2 border-slate-300">
            <button
              type="button"
              onClick={onAlternar}
              className="min-h-[48px] px-5 py-3 rounded-xl text-base font-bold text-slate-800 bg-white border-2 border-slate-400 hover:bg-slate-200 cursor-pointer text-center"
            >
              Cancelar y cerrar
            </button>
            
            {/* ÚNICO BOTÓN PRINCIPAL DESTACADO */}
            <button
              type="button"
              onClick={handleGuardar}
              className="min-h-[50px] px-7 py-3 rounded-xl text-lg font-black bg-emerald-800 hover:bg-emerald-900 text-white shadow-md border-2 border-emerald-950 active:scale-95 transition-all cursor-pointer text-center"
            >
              Publicar este objeto ahora
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
