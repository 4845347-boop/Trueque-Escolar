/**
 * @file types.ts
 * Definición de tipos de datos para la aplicación Trueque Escolar.
 * 
 * ATENCIÓN - PUNTO DE ERROR FRECUENTE:
 * No cambies las cadenas literales de los estados o categorías sin actualizar
 * los selectores y filtros correspondientes en los componentes visuales.
 */

// Categorías oficiales requeridas para los objetos del instituto
export type CategoriaObjeto = 'Libros' | 'Uniformes' | 'Útiles' | 'Otros';

// Estados del ciclo de vida del trueque
export type EstadoTrueque = 'disponible' | 'en_proceso' | 'intercambiado';

// Representación de un objeto publicado para trueque
export interface ObjetoTrueque {
  id: string;
  nombre: string;
  descripcion?: string;
  queBusca: string;
  categoria: CategoriaObjeto;
  estado: EstadoTrueque;
  fechaPublicacion: string;
  contacto: string;
  contactoOpcional?: string; // Compatibilidad hacia atrás con registros previos
}

// Representación de una sugerencia de trueque o match generada por Gemini
export interface SugerenciaTrueque {
  id: string;
  objetoAId: string;
  objetoATitulo: string;
  estudianteA: string;
  objetoBId: string;
  objetoBTitulo: string;
  estudianteB: string;
  motivoSugerencia: string;
  compatibilidadPorcentaje: number;
}

export interface RespuestaGeminiMatches {
  resumen: string;
  sugerencias: SugerenciaTrueque[];
}

