import { PostulacionRepository } from "../data/PostulacionRepository";
import { IPostulacion, ICrearPostulacionDTO, IActualizarPostulacionDTO } from "../models/Postulacion";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

export class PostulacionService {
  private repository: PostulacionRepository;

  constructor() {
    this.repository = new PostulacionRepository();
  }

  async obtenerPorEstudiante(idEstudiante: number): Promise<IPostulacion[]> {
    if (idEstudiante <= 0) {
      throw new ValidationError("El ID del estudiante debe ser un número positivo");
    }
    return await this.repository.listarPorEstudiante(idEstudiante);
  }

  async obtenerPorId(id: number): Promise<IPostulacion | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  async crearPostulacion(datos: ICrearPostulacionDTO): Promise<number> {
    if (!isNotEmpty(datos.carta_motivacion)) {
      throw new ValidationError("La carta de motivación es obligatoria");
    }

    if (!isNotEmpty(datos.curriculum_url)) {
      throw new ValidationError("La URL del currículum es obligatoria");
    }

    if (datos.fk_id_estudiante <= 0) {
      throw new ValidationError("El ID del estudiante es inválido");
    }

    if (datos.fk_id_oportunidad <= 0) {
      throw new ValidationError("El ID de la oportunidad es inválido");
    }

    return await this.repository.crearPostulacion(datos);
  }

  async actualizarEstadoPostulacion(id: number, datos: IActualizarPostulacionDTO): Promise<boolean> {
    const postulacionExistente = await this.repository.buscarPorId(id);
    if (!postulacionExistente) {
      throw new ValidationError("No existe una postulación con ID " + id);
    }

    return await this.repository.actualizarEstadoPostulacion(id, datos);
  }
}