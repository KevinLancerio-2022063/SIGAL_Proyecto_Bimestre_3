import { ProfesorRepository } from '../data/ProfesorRepository';
import { IProfesor, ICrearProfesorDTO, IActualizarProfesorDTO } from '../models/Profesor';
import { isNotEmpty } from '../utils/validators';
import { ValidationError } from '../utils/error';

// Servicio: lógica de negocio y validaciones para Profesor
export class ProfesorService {
  private repository: ProfesorRepository;

  constructor() {
    this.repository = new ProfesorRepository();
  }

  // Obtener todos los profesores
  async obtenerTodos(): Promise<IProfesor[]> {
    return await this.repository.listarProfesores();
  }

  // Obtener un profesor por su ID
  async obtenerPorId(id: number): Promise<IProfesor | null> {
    if (id <= 0) {
      throw new ValidationError('El ID debe ser un número positivo');
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear un nuevo profesor con validaciones
  async crearProfesor(datos: ICrearProfesorDTO): Promise<number> {
    if (!isNotEmpty(datos.numero_empleado)) {
      throw new ValidationError('El número de empleado es obligatorio');
    }

    if (!isNotEmpty(datos.departamento)) {
      throw new ValidationError('El departamento es obligatorio');
    }

    if (!isNotEmpty(datos.especialidad)) {
      throw new ValidationError('La especialidad es obligatoria');
    }

    if (datos.fk_id_usuario <= 0) {
      throw new ValidationError('El ID de usuario es inválido');
    }

    if (datos.fk_id_universidad <= 0) {
      throw new ValidationError('El ID de universidad es inválido');
    }

    return await this.repository.crearProfesor(datos);
  }

  // Actualizar un profesor existente
  async actualizarProfesor(id: number, datos: IActualizarProfesorDTO): Promise<boolean> {
    const profesorExistente = await this.repository.buscarPorId(id);
    if (!profesorExistente) {
      throw new ValidationError(`No existe un profesor con ID ${id}`);
    }

    if (datos.departamento && !isNotEmpty(datos.departamento)) {
      throw new ValidationError('El departamento no puede estar vacío');
    }

    return await this.repository.actualizarProfesor(id, datos);
  }

  // Eliminar un profesor
  async eliminarProfesor(id: number): Promise<boolean> {
    return await this.repository.eliminarProfesor(id);
  }
}