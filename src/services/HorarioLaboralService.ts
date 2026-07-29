import { HorarioLaboralRepository } from "../data/HorarioLaboralRepository";
import { IHorarioLaboral, ICrearHorarioLaboralDTO, IActualizarHorarioLaboralDTO } from "../models/HorarioLaboral";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Horario_Laboral
export class HorarioLaboralService {
  private repository: HorarioLaboralRepository;

  constructor() {
    this.repository = new HorarioLaboralRepository();
  }

  // Obtener horarios por estudiante
  async obtenerPorEstudiante(idEstudiante: number): Promise<IHorarioLaboral[]> {
    if (idEstudiante <= 0) {
      throw new ValidationError("El ID del estudiante debe ser un número positivo");
    }
    return await this.repository.listarPorEstudiante(idEstudiante);
  }

  // Obtener un horario por su ID
  async obtenerPorId(id: number): Promise<IHorarioLaboral | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear un nuevo horario laboral con validaciones
  async crearHorarioLaboral(datos: ICrearHorarioLaboralDTO): Promise<number> {
    if (datos.fk_id_estudiante <= 0) {
      throw new ValidationError("El ID del estudiante es inválido");
    }

    if (datos.fk_id_empleador <= 0) {
      throw new ValidationError("El ID del empleador es inválido");
    }

    if (!datos.puesto || !datos.supervisor) {
      throw new ValidationError("El puesto y el supervisor son obligatorios");
    }

    if (datos.salario < 0) {
      throw new ValidationError("El salario no puede ser negativo");
    }

    return await this.repository.crearHorarioLaboral(datos);
  }

  // Actualizar un horario laboral existente
  async actualizarHorarioLaboral(id: number, datos: IActualizarHorarioLaboralDTO): Promise<boolean> {
    const horarioExistente = await this.repository.buscarPorId(id);
    if (!horarioExistente) {
      throw new ValidationError("No existe un horario laboral con ID " + id);
    }

    return await this.repository.actualizarHorarioLaboral(id, datos);
  }

  // Eliminar un horario laboral
  async eliminarHorarioLaboral(id: number): Promise<boolean> {
    return await this.repository.eliminarHorarioLaboral(id);
  }
}