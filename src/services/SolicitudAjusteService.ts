import { SolicitudAjusteRepository } from "../data/SolicitudAjusteRepository";
import { ISolicitudAjuste, ICrearSolicitudAjusteDTO, IResolverSolicitudAjusteDTO } from "../models/SolicitudAjuste";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Solicitud_Ajuste
export class SolicitudAjusteService {
  private repository: SolicitudAjusteRepository;

  constructor() {
    this.repository = new SolicitudAjusteRepository();
  }

  // Obtener solicitudes por estudiante
  async obtenerPorEstudiante(idEstudiante: number): Promise<ISolicitudAjuste[]> {
    if (idEstudiante <= 0) {
      throw new ValidationError("El ID del estudiante debe ser un número positivo");
    }
    return await this.repository.listarPorEstudiante(idEstudiante);
  }

  // Obtener una solicitud por su ID
  async obtenerPorId(id: number): Promise<ISolicitudAjuste | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  // Agregar una nueva solicitud con validaciones
  async agregarSolicitud(datos: ICrearSolicitudAjusteDTO): Promise<number> {
    if (datos.fk_id_estudiante <= 0) {
      throw new ValidationError("El ID del estudiante es inválido");
    }

    if (!isNotEmpty(datos.descripcion)) {
      throw new ValidationError("La descripción es obligatoria");
    }

    if (!isNotEmpty(datos.justificacion)) {
      throw new ValidationError("La justificación es obligatoria");
    }

    return await this.repository.agregarSolicitud(datos);
  }

  // Resolver una solicitud existente
  async resolverSolicitud(id: number, datos: IResolverSolicitudAjusteDTO): Promise<boolean> {
    const solicitudExistente = await this.repository.buscarPorId(id);
    if (!solicitudExistente) {
      throw new ValidationError("No existe una solicitud con ID " + id);
    }

    if (!isNotEmpty(datos.justificacion)) {
      throw new ValidationError("La justificación de la resolución es obligatoria");
    }

    return await this.repository.resolverSolicitud(id, datos);
  }
}