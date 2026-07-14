import { UsuarioRepository } from '../data/usuarioRepository';
import { IUsuario, ICrearUsuarioDTO, IActualizarUsuarioDTO } from '../models/usuario';
import { isValidEmail, minLength, isNotEmpty } from '../utils/validators';
import { ValidationError } from '../utils/error';

// Servicio: contiene la lógica de negocio y validaciones
export class UsuarioService {
  private repository: UsuarioRepository;

  constructor() {
    // Creamos una instancia del repositorio
    this.repository = new UsuarioRepository();
  }

  // Obtener todos los usuarios
  async obtenerTodos(): Promise<IUsuario[]> {
    return await this.repository.listarUsuarios();
  }

  // Obtener un usuario por su ID
  async obtenerPorId(id: number): Promise<IUsuario | null> {
    // Validamos que el ID sea positivo
    if (id <= 0) {
      throw new ValidationError('El ID debe ser un número positivo');
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear un nuevo usuario con validaciones
  async crearUsuario(datos: ICrearUsuarioDTO): Promise<number> {
    // Validamos que el nombre no esté vacío
    if (!isNotEmpty(datos.nombre)) {
      throw new ValidationError('El nombre es obligatorio');
    }

    // Validamos que el email tenga formato correcto
    if (!isValidEmail(datos.email)) {
      throw new ValidationError('El email no tiene un formato válido');
    }

    // Validamos que la contraseña tenga al menos 6 caracteres
    if (!minLength(datos.contrasena, 6)) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
    }

    // Validamos que el tipo de usuario sea válido
    if (!isValidTipoUsuario(datos.tipo_usuario)) {
      throw new ValidationError('Tipo de usuario no válido');
    }

    // Creamos el usuario en la base de datos
    return await this.repository.crearUsuario(datos);
  }

  // Actualizar un usuario existente
  async actualizarUsuario(id: number, datos: IActualizarUsuarioDTO): Promise<boolean> {
    // Primero verificamos que el usuario exista
    const usuarioExistente = await this.repository.buscarPorId(id);
    if (!usuarioExistente) {
      throw new ValidationError(`No existe un usuario con ID ${id}`);
    }

    // Si viene email, validamos que tenga formato correcto
    if (datos.email && !isValidEmail(datos.email)) {
      throw new ValidationError('El email no tiene un formato válido');
    }

    // Actualizamos el usuario en la base de datos
    return await this.repository.actualizarUsuario(id, datos);
  }

  // Eliminar un usuario
  async eliminarUsuario(id: number): Promise<boolean> {
    // No permitimos eliminar el usuario administrador (ID 1)
    if (id === 1) {
      throw new ValidationError('No se puede eliminar el usuario administrador');
    }

    return await this.repository.eliminarUsuario(id);
  }
}

// Función auxiliar para validar tipo de usuario
function isValidTipoUsuario(tipo: string): boolean {
  return ['ESTUDIANTE', 'PROFESOR', 'EMPLEADOR', 'ADMIN'].includes(tipo);
}