/**
 * @file server.ts
 * Servidor Express con Vite middleware y punto de conexión seguro a la API de Gemini.
 * La clave de API se mantiene en el servidor y nunca se expone al navegador.
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Esquema estructurado estricto para las sugerencias de match de trueque
export const matchResponseSchema = {
  type: Type.OBJECT,
  properties: {
    resumen: {
      type: Type.STRING,
      description: 'Resumen amigable y motivador en español sobre las oportunidades de trueque encontradas.',
    },
    sugerencias: {
      type: Type.ARRAY,
      description: 'Lista de emparejamientos sugeridos entre objetos y estudiantes.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'Identificador único de la sugerencia (ej: match-1).',
          },
          objetoAId: {
            type: Type.STRING,
            description: 'Identificador del primer objeto en el catálogo.',
          },
          objetoATitulo: {
            type: Type.STRING,
            description: 'Nombre del objeto ofrecido por el Estudiante A.',
          },
          estudianteA: {
            type: Type.STRING,
            description: 'Nombre o curso del estudiante que ofrece el objeto A.',
          },
          objetoBId: {
            type: Type.STRING,
            description: 'Identificador del segundo objeto que hace match.',
          },
          objetoBTitulo: {
            type: Type.STRING,
            description: 'Nombre del objeto ofrecido por el Estudiante B.',
          },
          estudianteB: {
            type: Type.STRING,
            description: 'Nombre o curso del estudiante que ofrece el objeto B.',
          },
          motivoSugerencia: {
            type: Type.STRING,
            description: 'Explicación clara y sin tecnicismos de por qué este intercambio es beneficioso para ambos.',
          },
          compatibilidadPorcentaje: {
            type: Type.INTEGER,
            description: 'Porcentaje estimado de afinidad entre 60 y 100.',
          },
        },
        required: [
          'id',
          'objetoAId',
          'objetoATitulo',
          'estudianteA',
          'objetoBId',
          'objetoBTitulo',
          'estudianteB',
          'motivoSugerencia',
          'compatibilidadPorcentaje',
        ],
      },
    },
  },
  required: ['resumen', 'sugerencias'],
};

// Ejemplo de prueba fijo para desarrollar y testear sin gastar llamadas a la API
export const RESPUESTA_MOCK_EJEMPLO = {
  resumen: '¡Encontramos 2 oportunidades excelentes de trueque entre compañeros del mismo ciclo escolar!',
  sugerencias: [
    {
      id: 'match-1',
      objetoAId: 'trueque-manual-matematica',
      objetoATitulo: 'Matemática Activa 4.° Año (Editorial Puerto de Palos)',
      estudianteA: 'Lucas Benítez - 4.° 1.ª (Turno Mañana)',
      objetoBId: 'trueque-manual-historia',
      objetoBTitulo: 'Historia Argentina Contemporánea 4.° Año',
      estudianteB: 'Camila Sosa - 4.° 2.ª (Turno Tarde)',
      motivoSugerencia: 'Lucas necesita el manual de Historia de 4.° que ofrece Camila, y Camila busca el libro de Matemática que ofrece Lucas. ¡Es un trueque directo perfecto sin costo para ninguno!',
      compatibilidadPorcentaje: 98,
    },
    {
      id: 'match-2',
      objetoAId: 'trueque-campera-abrigo',
      objetoATitulo: 'Campera Polar de Invierno Oficial del Instituto (Talle 14)',
      estudianteA: 'Valentina R. - 2.° B',
      objetoBId: 'trueque-buzo-gimnasia',
      objetoBTitulo: 'Buzo de Gimnasia Institucional (Talle 16)',
      estudianteB: 'Martín Gómez - 3.° A',
      motivoSugerencia: 'Valentina busca ropa de abrigo talle 16 por cambio de estatura y Martín busca una campera talle 14 para su hermano menor.',
      compatibilidadPorcentaje: 88,
    },
  ],
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  /**
   * Endpoint para generar sugerencias de matches inteligentes usando Gemini
   */
  app.post('/api/gemini/match-sugerencias', async (req: Request, res: Response) => {
    try {
      const { items, usarMock } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      // Si el cliente solicita modo de prueba o si no hay clave configurada en .env, devolvemos el mock de desarrollo
      if (usarMock || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({
          exito: true,
          modoMock: !apiKey || apiKey === 'MY_GEMINI_API_KEY' || Boolean(usarMock),
          datos: RESPUESTA_MOCK_EJEMPLO,
        });
      }

      // Si hay menos de 2 objetos disponibles, no hay suficientes elementos para emparejar
      if (!Array.isArray(items) || items.length < 2) {
        return res.json({
          exito: true,
          datos: {
            resumen: 'Se necesitan al menos 2 objetos publicados para poder sugerir trueques entre compañeros.',
            sugerencias: [],
          },
        });
      }

      // Inicializar el cliente oficial del SDK @google/genai en el servidor
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Preparar el listado de objetos simplificado para el análisis
      const catalogoTexto = items
        .filter((item: any) => item.estado === 'disponible')
        .map((item: any, index: number) => {
          return `${index + 1}. [ID: ${item.id}] Objeto: "${item.nombre}" (${item.categoria}) | Lo que busca a cambio: "${item.queBusca}" | Contacto: "${item.contacto}" | Descripción: "${item.descripcion || 'Sin detalles adicionales'}"`;
        })
        .join('\n');

      const prompt = `Sos un coordinador escolar solidario que ayuda a estudiantes a intercambiar libros, uniformes y útiles escolares sin dinero.
Analizá el siguiente catálogo de objetos ofrecidos y qué busca a cambio cada alumno:

${catalogoTexto}

Identificá coincidencias mutuas o complementarias (estudiante A tiene lo que busca estudiante B, o artículos de valor y nivel equivalente).
Generá las sugerencias más claras, justas y realistas. Si no encontrás ninguna coincidencia viable, devolvé la lista de sugerencias vacía.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: matchResponseSchema,
          systemInstruction: 'Sos un asistente escolar empático y solidario. Explicá cada trueque con claridad en español rioplatense o neutro, destacando por qué le sirve a ambos estudiantes.',
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error('La respuesta del modelo llegó vacía.');
      }

      const datosParseados = JSON.parse(responseText);

      return res.json({
        exito: true,
        modoMock: false,
        datos: datosParseados,
      });
    } catch (error: any) {
      console.error('Error al generar sugerencias con Gemini:', error);
      return res.status(500).json({
        exito: false,
        error: 'No pudimos conectar con el asistente de sugerencias en este momento. Por favor intentá nuevamente.',
      });
    }
  });

  // Montar Vite en desarrollo o servir archivos estáticos en producción
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de Trueque Escolar listo en http://localhost:${PORT}`);
  });
}

startServer();
