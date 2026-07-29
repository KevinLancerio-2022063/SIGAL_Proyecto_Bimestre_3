import { CalificacionRepository } from "../data/CalificacionRepository";
import { ICalificacion, ICrearCalificacionDTO, IActualizarCalificacionDTO } from "../models/Calificacion";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Calificacion
export class CalificacionService {
  private repository: CalificacionRepository;

  constructor() {
    this.repository = new CalificacionRepository();
  }

  // Obtener calificaciones por estudiante
  async obtenerPorEstudiante(idEstudiante: number): Promise<ICalificacion[]> {
    if (idEstudiante <= 0) {
      throw new ValidationError("El ID del estudiante debe ser un número positivo");
    }
    return await this.repository.listarPorEstudiante(idEstudiante);
  }

  // Obtener una calificación por su ID
  async obtenerPorId(id: number): Promise<ICalificacion | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear una nueva calificación con validaciones
  async crearCalificacion(datos: ICrearCalificacionDTO): Promise<number> {
    if (datos.puntaje_obtenido < 0) {
      throw new ValidationError("El puntaje no puede ser negativo");
    }

    if (!isNotEmpty(datos.observaciones)) {
      throw new ValidationError("Las observaciones son obligatorias");
    }

    if (!isNotEmpty(datos.retroalimentacion)) {
      throw new ValidationError("La retroalimentación es obligatoria");
    }

    if (datos.fk_id_evaluacion <= 0) {
      throw new ValidationError("El ID de la evaluación es inválido");
    }

    if (datos.fk_id_estudiante <= 0) {
      throw new ValidationError("El ID del estudiante es inválido");
    }

    if (datos.fk_id_profesor <= 0) {
      throw new ValidationError("El ID del profesor es inválido");
    }

    return await this.repository.crearCalificacion(datos);
  }

  // Actualizar una calificación existente
  async actualizarCalificacion(id: number, datos: IActualizarCalificacionDTO): Promise<boolean> {
    const calificacionExistente = await this.repository.buscarPorId(id);
    if (!calificacionExistente) {
      throw new ValidationError("No existe una calificación con ID " + id);
    }

    if (datos.puntaje_obtenido !== undefined && datos.puntaje_obtenido < 0) {
      throw new ValidationError("El puntaje no puede ser negativo");
    }

    return await this.repository.actualizarCalificacion(id, datos);
  }
}