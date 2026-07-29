import { ConflictoHorarioRepository } from "../data/ConflictoHorarioRepository";
import { IConflictoHorario, ICrearConflictoHorarioDTO, IResolverConflictoHorarioDTO } from "../models/ConflictoHorario";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Conflicto_Horario
export class ConflictoHorarioService {
  private repository: ConflictoHorarioRepository;

  constructor() {
    this.repository = new ConflictoHorarioRepository();
  }

  // Obtener conflictos por estudiante
  async obtenerPorEstudiante(idEstudiante: number): Promise<IConflictoHorario[]> {
    if (idEstudiante <= 0) {
      throw new ValidationError("El ID del estudiante debe ser un número positivo");
    }
    return await this.repository.listarPorEstudiante(idEstudiante);
  }

  // Obtener un conflicto por su ID
  async obtenerPorId(id: number): Promise<IConflictoHorario | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  // Registrar un nuevo conflicto con validaciones
  async registrarConflicto(datos: ICrearConflictoHorarioDTO): Promise<number> {
    if (datos.fk_id_estudiante <= 0) {
      throw new ValidationError("El ID del estudiante es inválido");
    }

    if (!isNotEmpty(datos.solucion_propuesta)) {
      throw new ValidationError("La solución propuesta es obligatoria");
    }

    return await this.repository.registrarConflicto(datos);
  }

  // Resolver un conflicto existente
  async resolverConflicto(id: number, datos: IResolverConflictoHorarioDTO): Promise<boolean> {
    const conflictoExistente = await this.repository.buscarPorId(id);
    if (!conflictoExistente) {
      throw new ValidationError("No existe un conflicto con ID " + id);
    }

    if (!isNotEmpty(datos.solucion_propuesta)) {
      throw new ValidationError("La solución propuesta es obligatoria");
    }

    return await this.repository.resolverConflicto(id, datos);
  }
}