import { IncomingMessage, ServerResponse } from 'http';
import { EmpleadorService } from '../services/EmpleadorService';

const empleadorService = new EmpleadorService();

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

// Función que maneja las rutas de empleador
export const empleadorRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todos los empleadores
  if (url === '/api/empleadores' && req.method === 'GET') {
    try {
      const empleadores = await empleadorService.obtenerTodos();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: empleadores, total: empleadores.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener empleadores' }));
      return true;
    }
  }

  // GET: Obtener empleador por ID
  if (url.startsWith('/api/empleadores/') && req.method === 'GET') {
    try {
      const id = parseInt(url.split('/')[3]);
      const empleador = await empleadorService.obtenerPorId(id);
      
      if (!empleador) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Empleador no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: empleador }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener el empleador' }));
      return true;
    }
  }

  // POST: Crear un nuevo empleador
  if (url === '/api/empleadores' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const nuevoId = await empleadorService.crearEmpleador(body);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Empleador creado', data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al crear empleador';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar un empleador
  if (url.startsWith('/api/empleadores/') && req.method === 'PUT') {
    try {
      const id = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      const actualizado = await empleadorService.actualizarEmpleador(id, body);
      
      if (!actualizado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Empleador no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Empleador actualizado' }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al actualizar';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar un empleador
  if (url.startsWith('/api/empleadores/') && req.method === 'DELETE') {
    try {
      const id = parseInt(url.split('/')[3]);
      const eliminado = await empleadorService.eliminarEmpleador(id);
      
      if (!eliminado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Empleador no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Empleador eliminado' }));
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