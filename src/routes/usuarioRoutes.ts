import { IncomingMessage, ServerResponse } from 'http';
import { UsuarioService } from '../services/usuarioService';

const usuarioService = new UsuarioService();

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

// Función que maneja las rutas de usuario, retorna true si la manejó, false si no
export const usuarioRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todos los usuarios
  if (url === '/api/usuarios' && req.method === 'GET') {
    try {
      const usuarios = await usuarioService.obtenerTodos();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: usuarios, total: usuarios.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener usuarios' }));
      return true;
    }
  }

  // GET: Obtener usuario por ID
  if (url.startsWith('/api/usuarios/') && req.method === 'GET') {
    try {
      const id = parseInt(url.split('/')[3]);
      const usuario = await usuarioService.obtenerPorId(id);
      
      if (!usuario) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Usuario no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: usuario }));
      return true;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error al obtener el usuario' }));
      return true;
    }
  }

  // POST: Crear un nuevo usuario
  if (url === '/api/usuarios' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const nuevoId = await usuarioService.crearUsuario(body);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Usuario creado', data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al crear usuario';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar un usuario
  if (url.startsWith('/api/usuarios/') && req.method === 'PUT') {
    try {
      const id = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      const actualizado = await usuarioService.actualizarUsuario(id, body);
      
      if (!actualizado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Usuario no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Usuario actualizado' }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error al actualizar';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar un usuario
  if (url.startsWith('/api/usuarios/') && req.method === 'DELETE') {
    try {
      const id = parseInt(url.split('/')[3]);
      const eliminado = await usuarioService.eliminarUsuario(id);
      
      if (!eliminado) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Usuario no encontrado' }));
        return true;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Usuario eliminado' }));
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