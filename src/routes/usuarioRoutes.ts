import { Router, Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';

// Creamos el enrutador y la instancia del servicio
const router = Router();
const usuarioService = new UsuarioService();

// GET: Listar todos los usuarios
router.get('/usuarios', async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.obtenerTodos();
    res.status(200).json({ success: true, data: usuarios, total: usuarios.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});

// GET: Obtener un usuario por su ID
router.get('/usuarios/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const usuario = await usuarioService.obtenerPorId(id);
    
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el usuario' });
  }
});

// POST: Crear un nuevo usuario
router.post('/usuarios', async (req: Request, res: Response) => {
  try {
    const nuevoId = await usuarioService.crearUsuario(req.body);
    res.status(201).json({ success: true, message: 'Usuario creado', data: { id: nuevoId } });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear usuario';
    res.status(400).json({ success: false, message: mensaje });
  }
});

// PUT: Actualizar un usuario existente
router.put('/usuarios/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const actualizado = await usuarioService.actualizarUsuario(id, req.body);
    
    if (!actualizado) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ success: true, message: 'Usuario actualizado' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar';
    res.status(400).json({ success: false, message: mensaje });
  }
});

// DELETE: Eliminar un usuario
router.delete('/usuarios/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const eliminado = await usuarioService.eliminarUsuario(id);
    
    if (!eliminado) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar';
    res.status(400).json({ success: false, message: mensaje });
  }
});

export default router;