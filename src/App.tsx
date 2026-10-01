/**
 * @file App.tsx
 * Componente principal de Trueque Escolar con diseño accesible:
 * - Uso óptimo desde 320px de ancho y con una sola mano.
 * - Textos nunca menores a 16px (text-base) y alto contraste para exteriores/sol.
 * - Todos los controles con etiquetas visibles.
 * - Un solo botón principal por pantalla.
 * - Estado vacío amigable y cálido para la primera vez.
 * - Mensajes claros en español sin tecnicismos.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ObjetoTrueque, EstadoTrueque, CategoriaObjeto } from './types';
import { DATOS_INICIALES } from './data/initialData';
import { Header } from './components/Header';
import { CategoryFilter, FiltroCategoria } from './components/CategoryFilter';
import { ItemCard } from './components/ItemCard';
import { PublishSection } from './components/PublishSection';
import { MatchSuggestionsSection } from './components/MatchSuggestionsSection';
import { 
  Plus, 
  CheckCircle, 
  SearchX, 
  HeartHandshake,
  BookOpen,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'trueque_escolar_items_v1';

export default function App() {
  // Carga inicial persistente y tolerante a fallos
  const [objetos, setObjetos] = useState<ObjetoTrueque[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const parseado = JSON.parse(guardado);
        if (Array.isArray(parseado)) {
          return parseado;
        }
      }
    } catch {
      // Si falla, arranca con el catálogo inicial
    }
    return DATOS_INICIALES;
  });

  // Filtro por categoría seleccionada
  const [categoriaFiltro, setCategoriaFiltro] = useState<FiltroCategoria>('Todas');

  // Filtro para mostrar solo disponibles
  const [soloDisponibles, setSoloDisponibles] = useState<boolean>(false);

  // Apertura de la sección de publicación
  const [formularioAbierto, setFormularioAbierto] = useState<boolean>(false);

  // Mensaje en pantalla visible y sin tecnicismos
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  // Persistencia automática
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objetos));
    } catch {
      // Ignorar fallas silenciosas en modo privado
    }
  }, [objetos]);

  // Temporizador para ocultar el mensaje de confirmación
  useEffect(() => {
    if (!mensajeToast) return;
    const timer = setTimeout(() => {
      setMensajeToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [mensajeToast]);

  /**
   * REQUISITO 1: Publicar nuevo objeto
   */
  const handlePublicarObjeto = (
    datosNuevo: Omit<ObjetoTrueque, 'id' | 'fechaPublicacion' | 'estado'>
  ): boolean => {
    try {
      const nuevoObjeto: ObjetoTrueque = {
        ...datosNuevo,
        id: `trueque-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        estado: 'disponible',
        fechaPublicacion: 'Recién publicado',
      };

      const nuevaLista = [nuevoObjeto, ...objetos];
      setObjetos(nuevaLista);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaLista));
      } catch {
        // En caso de cuota excedida
      }

      // Mensaje en español sin tecnicismos
      setMensajeToast(`¡Excelente! "${nuevoObjeto.nombre}" ya está publicado y listo para intercambiar con tus compañeros.`);
      setFormularioAbierto(false);
      return true;
    } catch {
      setMensajeToast('No se pudo guardar la publicación. Por favor intentá nuevamente.');
      return false;
    }
  };

  /**
   * REQUISITO 3: Cambiar estado del objeto
   */
  const handleCambiarEstado = (id: string, nuevoEstado: EstadoTrueque) => {
    setObjetos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, estado: nuevoEstado };
        }
        return item;
      })
    );

    const nombresEstadosAmigables: Record<EstadoTrueque, string> = {
      disponible: 'Disponible para trueque',
      en_proceso: 'En proceso de intercambio',
      intercambiado: 'Intercambiado con éxito',
    };

    setMensajeToast(`Objeto actualizado a: ${nombresEstadosAmigables[nuevoEstado]}`);
  };

  /**
   * Guardar copia de seguridad en el dispositivo
   */
  const handleExportarRespaldo = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objetos, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `trueque-escolar-respaldo-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setMensajeToast('¡Copia de respaldo guardada en tu dispositivo!');
    } catch {
      setMensajeToast('No se pudo guardar la copia de respaldo.');
    }
  };

  /**
   * Volver al catálogo de inicio
   */
  const handleRestablecerCatalogo = () => {
    const confirmar = window.confirm('¿Querés volver al catálogo de inicio del instituto?');
    if (!confirmar) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setObjetos(DATOS_INICIALES);
      setMensajeToast('Se volvió al catálogo inicial con publicaciones de ejemplo.');
    } catch {
      // Ignorar fallas
    }
  };

  /**
   * REQUISITO 2: Filtrado reactivo por categoría
   */
  const objetosFiltrados = useMemo(() => {
    return objetos.filter((item) => {
      const coincideCategoria =
        categoriaFiltro === 'Todas' || item.categoria === categoriaFiltro;

      const coincideDisponibilidad = soloDisponibles
        ? item.estado === 'disponible'
        : true;

      return coincideCategoria && coincideDisponibilidad;
    });
  }, [objetos, categoriaFiltro, soloDisponibles]);

  // Conteo de objetos por categoría
  const conteoPorCategoria = useMemo(() => {
    const conteos: Record<FiltroCategoria, number> = {
      Todas: 0,
      Libros: 0,
      Uniformes: 0,
      Útiles: 0,
      Otros: 0,
    };

    objetos.forEach((item) => {
      if (!soloDisponibles || item.estado === 'disponible') {
        conteos.Todas += 1;
        if (conteos[item.categoria] !== undefined) {
          conteos[item.categoria] += 1;
        }
      }
    });

    return conteos;
  }, [objetos, soloDisponibles]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-28 sm:pb-16 text-base">
      {/* Encabezado fijo de alto contraste */}
      <Header
        onAbrirPublicar={() => {
          setFormularioAbierto((prev) => !prev);
          if (!formularioAbierto) {
            window.scrollTo({ top: 60, behavior: 'smooth' });
          }
        }}
        onExportarJSON={handleExportarRespaldo}
        formularioAbierto={formularioAbierto}
        totalObjetos={objetos.length}
      />

      {/* Contenido principal usable a partir de 320px de ancho */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 pt-5">
        {/* Banner institucional de bienvenida con alto contraste */}
        <section className="bg-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm mb-5 border-2 border-emerald-950">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-base font-extrabold bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full border border-emerald-700">
              <HeartHandshake className="w-5 h-5 shrink-0" />
              Solidaridad en el Instituto
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2 leading-snug">
            ¿Tenés libros o uniformes que ya no usás?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 font-medium leading-relaxed max-w-2xl">
            Intercambialos con tus compañeros de clase sin dinero de por medio. Publicá lo que tenés y qué estás necesitando para este año.
          </p>
        </section>

        {/* Sección integrada para publicar (sin <form>, sin modal) */}
        <PublishSection
          estaAbierto={formularioAbierto}
          onAlternar={() => setFormularioAbierto((prev) => !prev)}
          onPublicar={handlePublicarObjeto}
        />

        {/* Sugerencias de Matches y Trueques Ideales con Gemini */}
        <MatchSuggestionsSection objetos={objetos} />

        {/* Barra de Filtros con etiquetas visibles y alto contraste */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-300 shadow-xs mb-5">
          <CategoryFilter
            categoriaSeleccionada={categoriaFiltro}
            onSeleccionarCategoria={setCategoriaFiltro}
            conteoPorCategoria={conteoPorCategoria}
          />

          {/* Opciones con etiqueta visible y selector táctil amplio */}
          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <label 
              htmlFor="filtro-disponibles-visible" 
              className="flex items-center gap-3 cursor-pointer select-none text-slate-950 font-bold text-base min-h-[44px]"
            >
              <input
                id="filtro-disponibles-visible"
                type="checkbox"
                checked={soloDisponibles}
                onChange={(e) => setSoloDisponibles(e.target.checked)}
                className="w-6 h-6 text-emerald-800 focus:ring-4 focus:ring-emerald-700/30 border-2 border-slate-500 rounded cursor-pointer"
              />
              <span>Mostrar únicamente objetos disponibles</span>
            </label>

            <span className="text-base text-slate-800 font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
              {objetosFiltrados.length} de {objetos.length} objetos
            </span>
          </div>
        </section>

        {/* Catálogo de objetos */}
        <section aria-label="Catálogo de objetos escolares">
          {objetosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {objetosFiltrados.map((objeto) => (
                <ItemCard
                  key={objeto.id}
                  objeto={objeto}
                  onCambiarEstado={handleCambiarEstado}
                />
              ))}
            </div>
          ) : objetos.length === 0 ? (
            /* REQUISITO 5: Estado vacío cuando no hay absolutamente ningún objeto publicado */
            <div className="bg-white border-2 border-dashed border-emerald-600 rounded-3xl p-6 sm:p-10 text-center my-6 shadow-xs">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-emerald-300">
                <Sparkles className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3">
                ¡La mesa de trueque está lista para empezar!
              </h3>
              <p className="text-base sm:text-lg text-slate-800 font-medium max-w-md mx-auto mb-6 leading-relaxed">
                Todavía no hay ningún objeto publicado. Sé la primera persona en darle una segunda vida a tus libros, uniformes o útiles y ayudá a un compañero del instituto.
              </p>
              
              {/* ÚNICO BOTÓN PRINCIPAL cuando está vacío */}
              <button
                type="button"
                onClick={() => {
                  setFormularioAbierto(true);
                  window.scrollTo({ top: 80, behavior: 'smooth' });
                }}
                className="min-h-[52px] px-8 py-3.5 rounded-xl text-lg font-black bg-emerald-800 hover:bg-emerald-900 text-white shadow-md border-2 border-emerald-950 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
                <span>Publicar el primer objeto</span>
              </button>
            </div>
          ) : (
            /* Estado vacío cuando no hay coincidencias con el filtro actual */
            <div className="bg-white border-2 border-dashed border-slate-400 rounded-3xl p-6 sm:p-8 text-center my-6">
              <div className="w-16 h-16 bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <SearchX className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-2">
                No encontramos objetos en esta búsqueda
              </h3>
              <p className="text-base text-slate-800 font-medium max-w-md mx-auto mb-5">
                {soloDisponibles 
                  ? 'No hay objetos libres con estos filtros o ya fueron intercambiados.'
                  : `Aún no hay publicaciones en la categoría "${categoriaFiltro}".`}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {categoriaFiltro !== 'Todas' && (
                  <button
                    type="button"
                    onClick={() => setCategoriaFiltro('Todas')}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl text-base font-bold bg-white text-slate-900 border-2 border-slate-400 hover:bg-slate-100 cursor-pointer w-full sm:w-auto"
                  >
                    Ver todas las categorías
                  </button>
                )}
                
                {/* BOTÓN SECUNDARIO en este estado para no competir con el principal */}
                <button
                  type="button"
                  onClick={() => {
                    setFormularioAbierto(true);
                    window.scrollTo({ top: 80, behavior: 'smooth' });
                  }}
                  className="min-h-[48px] px-6 py-2.5 rounded-xl text-base font-bold bg-slate-900 text-white hover:bg-slate-800 border-2 border-slate-900 cursor-pointer w-full sm:w-auto"
                >
                  Ofrecer un objeto en esta categoría
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Pie informativo claro, sin tecnicismos y con texto >= 16px */}
        <footer className="mt-10 pt-6 border-t-2 border-slate-300 text-center text-base text-slate-800 pb-4">
          <p className="mb-3 font-medium">
            Tus publicaciones se guardan de forma automática en este dispositivo para que no las pierdas al salir.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-base font-bold">
            <button
              type="button"
              onClick={handleExportarRespaldo}
              className="text-emerald-900 hover:underline min-h-[44px] flex items-center cursor-pointer"
            >
              Descargar copia de respaldo
            </button>
            <span className="text-slate-400 font-bold">•</span>
            <button
              type="button"
              onClick={handleRestablecerCatalogo}
              className="text-slate-700 hover:text-slate-950 hover:underline min-h-[44px] flex items-center cursor-pointer"
            >
              Volver al catálogo de inicio
            </button>
          </div>
        </footer>
      </main>

      {/* Botón flotante para celular con altura de 52px y etiqueta clara */}
      <div className="fixed bottom-6 right-5 sm:hidden z-40">
        <button
          type="button"
          onClick={() => {
            setFormularioAbierto(true);
            window.scrollTo({ top: 60, behavior: 'smooth' });
          }}
          className="min-h-[52px] flex items-center gap-2.5 bg-slate-900 text-white font-extrabold px-5 py-3 rounded-full shadow-xl border-2 border-slate-700 active:scale-95 cursor-pointer text-base"
          aria-label="Publicar nuevo objeto"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          <span>Publicar</span>
        </button>
      </div>

      {/* Mensajes de confirmación visibles, en español y sin tecnicismos */}
      {mensajeToast && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-base font-bold flex items-center gap-3 max-w-[92vw] border-2 border-slate-700 animate-in fade-in slide-in-from-bottom-3"
        >
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          <span className="leading-snug">{mensajeToast}</span>
        </div>
      )}
    </div>
  );
}
