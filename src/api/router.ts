import { IncomingMessage, ServerResponse } from 'http';
import { usuarioRoutes } from '../routes/usuarioRoutes';
import { universidadRoutes } from '../routes/universidadRoutes';
import { estudianteRoutes } from '../routes/estudianteRoutes';
import { profesorRoutes } from '../routes/profesorRoutes';

// Función principal que enruta las peticiones
export const router = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<void> => {
  
  // Ruta raíz: muestra un menú de rutas disponibles
  if (url === '/' || url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'SIGAL API - Servidor Nativo Node.js',
      routes: {
        usuarios: ['/api/usuarios', '/api/usuarios/:id'],
        universidades: ['/api/universidades', '/api/universidades/:id'],
        estudiantes: ['/api/estudiantes', '/api/estudiantes/:id'],
        profesores: ['/api/profesores', '/api/profesores/:id']
      }
    }, null, 2));
    return;
  }

  if (await usuarioRoutes(req, res, url)) return;
  if (await universidadRoutes(req, res, url)) return;
  if (await estudianteRoutes(req, res, url)) return;
  
  // Intentamos con las rutas de profesores
  if (await profesorRoutes(req, res, url)) {
    return;
  }

  // Si ninguna ruta coincidió: Error 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    success: false, 
    message: 'Ruta no encontrada',
    method: req.method,
    url: url
  }));
};