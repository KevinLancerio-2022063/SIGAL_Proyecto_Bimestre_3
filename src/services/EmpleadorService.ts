import { EmpleadorRepository } from '../data/EmpleadorRepository';
import { IEmpleador, ICrearEmpleadorDTO, IActualizarEmpleadorDTO } from '../models/Empleador';
import { isNotEmpty } from '../utils/validators';
import { ValidationError } from '../utils/error';

// Servicio: lógica de negocio y validaciones para Empleador
export class EmpleadorService {
  private repository: EmpleadorRepository;

  constructor() {
    this.repository = new EmpleadorRepository();
  }

  // Obtener todos los empleadores
  async obtenerTodos(): Promise<IEmpleador[]> {
    return await this.repository.listarEmpleadores();
  }

  // Obtener un empleador por su ID
  async obtenerPorId(id: number): Promise<IEmpleador | null> {
    if (id <= 0) {
      throw new ValidationError('El ID debe ser un número positivo');
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear un nuevo empleador con validaciones
  async crearEmpleador(datos: ICrearEmpleadorDTO): Promise<number> {
    if (!isNotEmpty(datos.nombre_empresa)) {
      throw new ValidationError('El nombre de la empresa es obligatorio');
    }

    if (!isNotEmpty(datos.nit)) {
      throw new ValidationError('El NIT es obligatorio');
    }

    if (!isNotEmpty(datos.sector)) {
      throw new ValidationError('El sector es obligatorio');
    }

    if (datos.fk_id_usuario <= 0) {
      throw new ValidationError('El ID de usuario es inválido');
    }

    return await this.repository.crearEmpleador(datos);
  }

  // Actualizar un empleador existente
  async actualizarEmpleador(id: number, datos: IActualizarEmpleadorDTO): Promise<boolean> {
    const empleadorExistente = await this.repository.buscarPorId(id);
    if (!empleadorExistente) {
      throw new ValidationError(`No existe un empleador con ID ${id}`);
    }

    if (datos.nombre_empresa && !isNotEmpty(datos.nombre_empresa)) {
      throw new ValidationError('El nombre de la empresa no puede estar vacío');
    }

    return await this.repository.actualizarEmpleador(id, datos);
  }

  // Eliminar un empleador
  async eliminarEmpleador(id: number): Promise<boolean> {
    return await this.repository.eliminarEmpleador(id);
  }
}