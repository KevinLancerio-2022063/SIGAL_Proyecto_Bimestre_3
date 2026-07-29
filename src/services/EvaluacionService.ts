import { EvaluacionRepository } from "../data/EvaluacionRepository";
import { IEvaluacion, ICrearEvaluacionDTO } from "../models/Evaluacion";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

export class EvaluacionService {
  private repository: EvaluacionRepository;

  constructor() {
    this.repository = new EvaluacionRepository();
  }

  async obtenerPorCurso(idCurso: number): Promise<IEvaluacion[]> {
    if (idCurso <= 0) {
      throw new ValidationError("El ID del curso debe ser un número positivo");
    }
    return await this.repository.listarPorCurso(idCurso);
  }

  async obtenerPorId(id: number): Promise<IEvaluacion | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  async crearEvaluacion(datos: ICrearEvaluacionDTO): Promise<number> {
    if (!isNotEmpty(datos.nombre)) {
      throw new ValidationError("El nombre de la evaluación es obligatorio");
    }

    if (!isNotEmpty(datos.descripcion)) {
      throw new ValidationError("La descripción es obligatoria");
    }

    if (datos.fk_id_curso <= 0) {
      throw new ValidationError("El ID del curso es inválido");
    }

    if (datos.fk_id_profesor <= 0) {
      throw new ValidationError("El ID del profesor es inválido");
    }

    if (datos.puntaje_maximo <= 0) {
      throw new ValidationError("El puntaje máximo debe ser mayor a 0");
    }

    return await this.repository.crearEvaluacion(datos);
  }

  async eliminarEvaluacion(id: number): Promise<boolean> {
    return await this.repository.eliminarEvaluacion(id);
  }
}