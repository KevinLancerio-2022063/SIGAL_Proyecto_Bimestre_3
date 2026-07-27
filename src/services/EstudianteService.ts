import { EstudianteRepository } from '../data/EstudianteRepository';
import { IEstudiante, ICrearEstudianteDTO, IActualizarEstudianteDTO } from '../models/Estudiante';
import { isNotEmpty } from '../utils/validators';
import { ValidationError } from '../utils/error';

// Servicio: contiene la lógica de negocio y validaciones para Estudiante
export class EstudianteService {
  private repository: EstudianteRepository;

  constructor() {
    this.repository = new EstudianteRepository();
  }

  // Obtener todos los estudiantes con JOINs
  async obtenerTodos(): Promise<IEstudiante[]> {
    return await this.repository.listarEstudiantes();
  }

  // Obtener un estudiante por su ID
  async obtenerPorId(id: number): Promise<IEstudiante | null> {
    if (id <= 0) {
      throw new ValidationError('El ID debe ser un número positivo');
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear un nuevo estudiante con validaciones
  async crearEstudiante(datos: ICrearEstudianteDTO): Promise<number> {
    // Validamos que la matrícula no esté vacía
    if (!isNotEmpty(datos.matricula)) {
      throw new ValidationError('La matrícula es obligatoria');
    }

    // Validamos que la carrera no esté vacía
    if (!isNotEmpty(datos.carrera)) {
      throw new ValidationError('La carrera es obligatoria');
    }

    // Validamos que el semestre sea mayor a 0
    if (datos.semestre <= 0) {
      throw new ValidationError('El semestre debe ser mayor a 0');
    }

    // Validamos que el código interno no esté vacío
    if (!isNotEmpty(datos.codigo_interno)) {
      throw new ValidationError('El código interno es obligatorio');
    }

    // Validamos que exista el usuario
    if (datos.fk_id_usuario <= 0) {
      throw new ValidationError('El ID de usuario es inválido');
    }

    // Validamos que exista la universidad
    if (datos.fk_id_universidad <= 0) {
      throw new ValidationError('El ID de universidad es inválido');
    }

    // Creamos el estudiante en la base de datos
    return await this.repository.crearEstudiante(datos);
  }

  // Actualizar un estudiante existente
  async actualizarEstudiante(id: number, datos: IActualizarEstudianteDTO): Promise<boolean> {
    // Primero verificamos que el estudiante exista
    const estudianteExistente = await this.repository.buscarPorId(id);
    if (!estudianteExistente) {
      throw new ValidationError(`No existe un estudiante con ID ${id}`);
    }

    // Si viene carrera, validamos que no esté vacía
    if (datos.carrera && !isNotEmpty(datos.carrera)) {
      throw new ValidationError('La carrera no puede estar vacía');
    }

    // Si viene semestre, validamos que sea mayor a 0
    if (datos.semestre !== undefined && datos.semestre <= 0) {
      throw new ValidationError('El semestre debe ser mayor a 0');
    }

    // Actualizamos el estudiante en la base de datos
    return await this.repository.actualizarEstudiante(id, datos);
  }

  // Eliminar un estudiante
  async eliminarEstudiante(id: number): Promise<boolean> {
    return await this.repository.eliminarEstudiante(id);
  }
}