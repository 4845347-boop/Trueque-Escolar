/**
 * @file initialData.ts
 * Semilla de datos iniciales para Trueque Escolar.
 * 
 * ATENCIÓN - PUNTO DE ERROR FRECUENTE:
 * Si se modifica esta estructura o los campos requeridos, verificar que coincidan
 * con la interfaz ObjetoTrueque en types.ts para evitar errores de compilación o de render.
 */

import { ObjetoTrueque } from '../types';

export const DATOS_INICIALES: ObjetoTrueque[] = [
  {
    id: 'trueque-1',
    nombre: 'Manual de Biología 2.° Año (Editorial Santillana)',
    descripcion: 'En buen estado general, tiene algunos párrafos subrayados en lápiz suave pero todas las hojas completas y legibles.',
    queBusca: 'Manual de Historia de 2.° año o Geografía.',
    categoria: 'Libros',
    estado: 'disponible',
    fechaPublicacion: 'Hace 2 días',
    contacto: 'Martín - 3.º B (Turno Mañana)'
  },
  {
    id: 'trueque-2',
    nombre: 'Chomba deportiva del instituto (Talle M)',
    descripcion: 'Color azul marino oficial con escudo bordado. Usada solo un trimestre por cambio de talle, casi nueva.',
    queBusca: 'Pantalón de gimnasia talle L o campera de abrigo talle L.',
    categoria: 'Uniformes',
    estado: 'disponible',
    fechaPublicacion: 'Ayer',
    contacto: 'Sofía - 5.º A'
  },
  {
    id: 'trueque-3',
    nombre: 'Calculadora Científica Casio fx-82MS',
    descripcion: 'Funciona perfectamente con pila nueva puesta la semana pasada. Incluye tapa protectora.',
    queBusca: 'Juego de reglas técnicas Rotring o libro de Química 4.° año.',
    categoria: 'Útiles',
    estado: 'en_proceso',
    fechaPublicacion: 'Hace 3 días',
    contacto: 'Lucas - 4.º C'
  },
  {
    id: 'trueque-4',
    nombre: 'Mochila escolar reforzada con compartimento para carpeta',
    descripcion: 'Cierres en perfecto estado, lavada y lista para usar. Color negro y gris.',
    queBusca: 'Carpeta de dibujo N.° 6 completa o diccionario de inglés avanzado.',
    categoria: 'Otros',
    estado: 'intercambiado',
    fechaPublicacion: 'Hace 1 semana',
    contacto: 'Camila - 1.º B'
  }
];
