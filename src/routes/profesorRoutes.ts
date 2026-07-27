import { IncomingMessage, ServerResponse } from 'http';
import { ProfesorService } from '../services/ProfesorService';

const profesorService = new ProfesorService();

// Función auxiliar para leer el cuerpo de la petición en Node nativo
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

// Función que maneja las rutas de profesor
export const profesorRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todos los profesores
  if (url === '/api/profesores' && req.method === 'GET') {
    try {
      const profesores = await profesorService.obtenerTodos();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: profesores, total: profesores.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener profesores' }));
      return true;
    }
  }

  // GET: Obtener profesor por ID
  if (url.startsWith('/api/profesores/') && req.method === 'GET') {
    try {
      const id = parseInt(url.split('/')[3]);
      const profesor = await profesorService.obtenerPorId(id);
      
      if (!profesor) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Profesor no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: profesor }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener el profesor' }));
      return true;
    }
  }

  // POST: Crear un nuevo profesor
  if (url === '/api/profesores' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const nuevoId = await profesorService.crearProfesor(body);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Profesor creado', data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al crear profesor';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar un profesor
  if (url.startsWith('/api/profesores/') && req.method === 'PUT') {
    try {
      const id = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      const actualizado = await profesorService.actualizarProfesor(id, body);
      
      if (!actualizado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Profesor no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Profesor actualizado' }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al actualizar';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar un profesor
  if (url.startsWith('/api/profesores/') && req.method === 'DELETE') {
    try {
      const id = parseInt(url.split('/')[3]);
      const eliminado = await profesorService.eliminarProfesor(id);
      
      if (!eliminado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Profesor no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Profesor eliminado' }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al eliminar';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  return false;
};