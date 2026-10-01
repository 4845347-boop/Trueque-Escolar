/**
 * @file MatchSuggestionsSection.tsx
 * Sección que consume la API de Gemini para sugerir "matches" o trueques ideales
 * entre los estudiantes, mostrándolos en tarjetas de alto contraste.
 */

import React, { useState } from 'react';
import { ObjetoTrueque, SugerenciaTrueque, RespuestaGeminiMatches } from '../types';
import { 
  Sparkles, 
  ArrowLeftRight, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  FlaskConical,
  UserCheck
} from 'lucide-react';

interface MatchSuggestionsSectionProps {
  objetos: ObjetoTrueque[];
}

export const MatchSuggestionsSection: React.FC<MatchSuggestionsSectionProps> = ({ objetos }) => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaGeminiMatches | null>(null);
  const [usarModoPrueba, setUsarModoPrueba] = useState<boolean>(false);
  const [seccionExpandida, setSeccionExpandida] = useState<boolean>(false);

  const objetosDisponibles = objetos.filter((o) => o.estado === 'disponible');

  const handleAnalizarMatches = async (forzarMock: boolean = usarModoPrueba) => {
    setCargando(true);
    setError(null);
    setSeccionExpandida(true);

    try {
      const respuesta = await fetch('/api/gemini/match-sugerencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: objetosDisponibles,
          usarMock: forzarMock,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Fallo en la comunicación con el servidor.');
      }

      const datos = await respuesta.json();

      if (!datos.exito) {
        throw new Error(datos.error || 'Error al procesar la sugerencia.');
      }

      setResultado(datos.datos);
    } catch (err: any) {
      console.error('Error al solicitar matches a Gemini:', err);
      // REQUISITO 4: Mensaje claro en español sin palabras técnicas
      setError(
        'No pudimos conectar con el asistente de sugerencias en este momento. Podés revisar el catálogo manualmente o probar de nuevo en unos instantes.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border-2 border-emerald-700 shadow-sm mb-6 overflow-hidden">
      {/* Cabecera del panel de matches de IA */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                  Sugerencias de Trueques Ideales
                </h2>
                <span className="text-base font-extrabold bg-emerald-700 text-white px-2.5 py-0.5 rounded-full border border-emerald-500">
                  Inteligencia Solidaria
                </span>
              </div>
              <p className="text-base text-emerald-100 font-medium mt-0.5">
                Gemini analiza qué ofrece cada alumno y qué necesita para emparejarlos automáticamente.
              </p>
            </div>
          </div>

          {/* Botón para iniciar el análisis */}
          <button
            type="button"
            onClick={() => handleAnalizarMatches()}
            disabled={cargando}
            className="min-h-[50px] px-6 py-3 rounded-xl text-base font-black bg-white text-emerald-950 hover:bg-emerald-50 border-2 border-white shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {cargando ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analizando trueques...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>Buscar matches ideales</span>
              </>
            )}
          </button>
        </div>

        {/* Opción para alternar modo prueba sin gastar llamadas */}
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between flex-wrap gap-2 text-base">
          <label 
            htmlFor="toggle-mock-test"
            className="flex items-center gap-2.5 cursor-pointer select-none text-emerald-100 font-semibold"
          >
            <input
              id="toggle-mock-test"
              type="checkbox"
              checked={usarModoPrueba}
              onChange={(e) => setUsarModoPrueba(e.target.checked)}
              className="w-5 h-5 text-emerald-700 rounded border-white/40 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-300" />
              Usar respuesta de prueba (para probar sin gastar cuota de la API)
            </span>
          </label>
        </div>
      </div>

      {/* Contenido dinámico tras realizar la búsqueda */}
      {seccionExpandida && (
        <div className="p-4 sm:p-6 bg-slate-50 border-t-2 border-slate-300">
          {/* 1. Estado de carga */}
          {cargando && (
            <div className="py-8 text-center">
              <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-lg font-black text-slate-900 mb-1">
                Analizando el catálogo escolar...
              </p>
              <p className="text-base font-medium text-slate-700 max-w-md mx-auto">
                Cruzando los libros, uniformes y útiles disponibles con lo que cada estudiante está necesitando.
              </p>
            </div>
          )}

          {/* 2. REQUISITO 4: Manejo de fallo cuando la IA no responde o hay error */}
          {!cargando && error && (
            <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
                <div className="text-left flex-1">
                  <h3 className="text-lg font-black text-rose-950 mb-1">
                    No pudimos obtener las sugerencias
                  </h3>
                  <p className="text-base font-medium text-rose-900 mb-4 leading-relaxed">
                    {error}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAnalizarMatches()}
                      className="min-h-[46px] px-5 py-2.5 rounded-xl text-base font-bold bg-rose-800 hover:bg-rose-900 text-white cursor-pointer"
                    >
                      Reintentar ahora
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnalizarMatches(true)}
                      className="min-h-[46px] px-5 py-2.5 rounded-xl text-base font-bold bg-white text-slate-900 border-2 border-slate-400 hover:bg-slate-100 cursor-pointer"
                    >
                      Cargar respuesta de prueba
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. REQUISITO 4: Manejo cuando no se encuentran matches viables */}
          {!cargando && !error && resultado && resultado.sugerencias.length === 0 && (
            <div className="p-6 bg-amber-50 border-2 border-amber-400 rounded-2xl text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center mx-auto mb-3 border border-amber-300">
                <HelpCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-amber-950 mb-2">
                Aún no encontramos trueques complementarios
              </h3>
              <p className="text-base text-amber-900 font-medium max-w-lg mx-auto mb-4 leading-relaxed">
                {resultado.resumen ||
                  'No hay suficientes coincidencias mutuas entre lo que ofrecen y buscan los alumnos actualmente. ¡Probá más tarde cuando otros compañeros sumen nuevos artículos!'}
              </p>
              <button
                type="button"
                onClick={() => handleAnalizarMatches(true)}
                className="min-h-[46px] px-5 py-2.5 rounded-xl text-base font-bold bg-white text-slate-900 border-2 border-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                Ver ejemplo de sugerencias de prueba
              </button>
            </div>
          )}

          {/* 4. REQUISITO 2: Tarjetas de sugerencias emparejadas con alto contraste */}
          {!cargando && !error && resultado && resultado.sugerencias.length > 0 && (
            <div>
              {/* Resumen del análisis de Gemini */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded-2xl mb-5 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-black text-emerald-950 uppercase tracking-wide">
                    Balance del análisis
                  </h3>
                  <p className="text-base font-bold text-emerald-950 leading-relaxed mt-0.5">
                    {resultado.resumen}
                  </p>
                </div>
              </div>

              {/* Lista de tarjetas emparejadas */}
              <div className="space-y-4">
                {resultado.sugerencias.map((sug, index) => (
                  <article
                    key={sug.id || index}
                    className="bg-white border-2 border-slate-400 rounded-2xl p-5 shadow-xs transition-all hover:border-emerald-700"
                  >
                    {/* Encabezado del match con afinidad */}
                    <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-slate-200">
                      <span className="text-base font-black text-slate-950 uppercase tracking-wide">
                        Combinación recomendada #{index + 1}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-base font-extrabold bg-emerald-800 text-white px-3 py-1 rounded-lg border-2 border-emerald-950">
                        <CheckCircle2 className="w-4 h-4" />
                        {sug.compatibilidadPorcentaje}% de afinidad
                      </span>
                    </div>

                    {/* Las dos partes del intercambio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Lado A */}
                      <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-base font-bold text-slate-700 mb-1">
                            <UserCheck className="w-5 h-5 text-slate-800" />
                            <span>{sug.estudianteA}</span>
                          </div>
                          <p className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                            Ofrece: {sug.objetoATitulo}
                          </p>
                        </div>
                      </div>

                      {/* Lado B */}
                      <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-base font-bold text-slate-700 mb-1">
                            <UserCheck className="w-5 h-5 text-slate-800" />
                            <span>{sug.estudianteB}</span>
                          </div>
                          <p className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                            Ofrece: {sug.objetoBTitulo}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Explicación en español sin tecnicismos */}
                    <div className="bg-emerald-50/60 border-2 border-emerald-500 rounded-xl p-3.5">
                      <div className="flex items-center gap-2 text-base font-black text-emerald-950 mb-1">
                        <ArrowLeftRight className="w-5 h-5 text-emerald-800 shrink-0" />
                        <span>¿Por qué es un trueque ideal?</span>
                      </div>
                      <p className="text-base font-semibold text-emerald-950 leading-relaxed">
                        {sug.motivoSugerencia}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
