import { HorarioAcademicoRepository } from "../data/HorarioAcademicoRepository";
import { IHorarioAcademico, ICrearHorarioAcademicoDTO } from "../models/HorarioAcademico";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Horario_Academico
export class HorarioAcademicoService {
  private repository: HorarioAcademicoRepository;

  constructor() {
    this.repository = new HorarioAcademicoRepository();
  }

  // Obtener horarios por estudiante
  async obtenerPorEstudiante(idEstudiante: number): Promise<IHorarioAcademico[]> {
    if (idEstudiante <= 0) {
      throw new ValidationError("El ID del estudiante debe ser un número positivo");
    }
    return await this.repository.listarPorEstudiante(idEstudiante);
  }

  // Obtener un horario por su ID
  async obtenerPorId(id: number): Promise<IHorarioAcademico | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear un nuevo horario académico con validaciones
  async crearHorarioAcademico(datos: ICrearHorarioAcademicoDTO): Promise<number> {
    if (datos.fk_id_estudiante <= 0) {
      throw new ValidationError("El ID del estudiante es inválido");
    }

    if (datos.fk_id_curso <= 0) {
      throw new ValidationError("El ID del curso es inválido");
    }

    if (!datos.hora_inicio || !datos.hora_fin) {
      throw new ValidationError("Las horas de inicio y fin son obligatorias");
    }

    return await this.repository.crearHorarioAcademico(datos);
  }

  // Eliminar un horario académico
  async eliminarHorarioAcademico(id: number): Promise<boolean> {
    return await this.repository.eliminarHorarioAcademico(id);
  }
}