import { IncomingMessage, ServerResponse } from 'http';
import { EstudianteService } from '../services/EstudianteService';

const estudianteService = new EstudianteService();

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

// Función que maneja las rutas de estudiante, retorna true si la manejó, false si no
export const estudianteRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todos los estudiantes
  if (url === '/api/estudiantes' && req.method === 'GET') {
    try {
      const estudiantes = await estudianteService.obtenerTodos();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: estudiantes, total: estudiantes.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener estudiantes' }));
      return true;
    }
  }

  // GET: Obtener estudiante por ID
  if (url.startsWith('/api/estudiantes/') && req.method === 'GET') {
    try {
      const id = parseInt(url.split('/')[3]);
      const estudiante = await estudianteService.obtenerPorId(id);
      
      if (!estudiante) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Estudiante no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: estudiante }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener el estudiante' }));
      return true;
    }
  }

  // POST: Crear un nuevo estudiante
  if (url === '/api/estudiantes' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const nuevoId = await estudianteService.crearEstudiante(body);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Estudiante creado', data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al crear estudiante';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar un estudiante
  if (url.startsWith('/api/estudiantes/') && req.method === 'PUT') {
    try {
      const id = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      const actualizado = await estudianteService.actualizarEstudiante(id, body);
      
      if (!actualizado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Estudiante no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Estudiante actualizado' }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al actualizar';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar un estudiante
  if (url.startsWith('/api/estudiantes/') && req.method === 'DELETE') {
    try {
      const id = parseInt(url.split('/')[3]);
      const eliminado = await estudianteService.eliminarEstudiante(id);
      
      if (!eliminado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Estudiante no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Estudiante eliminado' }));
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