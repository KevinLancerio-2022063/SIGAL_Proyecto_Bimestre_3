import { IncomingMessage, ServerResponse } from 'http';
import { UniversidadService } from '../services/UniversidadService';

const universidadService = new UniversidadService();

// Función auxiliar para leer el cuerpo (body) de la petición en Node nativo
const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
  });
};

// Función que maneja las rutas de universidad, retorna true si la manejó, false si no
export const universidadRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todas las universidades
  if (url === '/api/universidades' && req.method === 'GET') {
    try {
      const universidades = await universidadService.obtenerTodas();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: universidades, total: universidades.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener universidades' }));
      return true;
    }
  }

  // GET: Obtener universidad por ID
  if (url.startsWith('/api/universidades/') && req.method === 'GET') {
    try {
      const id = parseInt(url.split('/')[3]);
      const universidad = await universidadService.obtenerPorId(id);
      
      if (!universidad) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Universidad no encontrada' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: universidad }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener la universidad' }));
      return true;
    }
  }

  // POST: Crear una nueva universidad
  if (url === '/api/universidades' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const nuevoId = await universidadService.crearUniversidad(body);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Universidad creada', data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al crear universidad';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar una universidad
  if (url.startsWith('/api/universidades/') && req.method === 'PUT') {
    try {
      const id = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      const actualizada = await universidadService.actualizarUniversidad(id, body);
      
      if (!actualizada) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Universidad no encontrada' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Universidad actualizada' }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al actualizar';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar una universidad
  if (url.startsWith('/api/universidades/') && req.method === 'DELETE') {
    try {
      const id = parseInt(url.split('/')[3]);
      const eliminada = await universidadService.eliminarUniversidad(id);
      
      if (!eliminada) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Universidad no encontrada' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Universidad eliminada' }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al eliminar';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // Si la URL no coincide con ninguna de las anteriores, retornamos false
  return false;
};