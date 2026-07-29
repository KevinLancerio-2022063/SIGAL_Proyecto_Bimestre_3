import { OportunidadRepository } from "../data/OportunidadRepository";
import { IOportunidad, ICrearOportunidadDTO, IActualizarOportunidadDTO } from "../models/Oportunidad";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Oportunidad
export class OportunidadService {
  private repository: OportunidadRepository;

  constructor() {
    this.repository = new OportunidadRepository();
  }

  // Obtener todas las oportunidades
  async obtenerTodas(): Promise<IOportunidad[]> {
    return await this.repository.listarOportunidades();
  }

  // Obtener una oportunidad por su ID
  async obtenerPorId(id: number): Promise<IOportunidad | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear una nueva oportunidad con validaciones
  async crearOportunidad(datos: ICrearOportunidadDTO): Promise<number> {
    if (!isNotEmpty(datos.titulo)) {
      throw new ValidationError("El título es obligatorio");
    }

    if (!isNotEmpty(datos.descripcion)) {
      throw new ValidationError("La descripción es obligatoria");
    }

    if (datos.fk_id_empleador <= 0) {
      throw new ValidationError("El ID de empleador es inválido");
    }

    if (datos.fk_id_universidad <= 0) {
      throw new ValidationError("El ID de universidad es inválido");
    }

    return await this.repository.crearOportunidad(datos);
  }

  // Actualizar una oportunidad existente
  async actualizarOportunidad(id: number, datos: IActualizarOportunidadDTO): Promise<boolean> {
    const oportunidadExistente = await this.repository.buscarPorId(id);
    if (!oportunidadExistente) {
      throw new ValidationError("No existe una oportunidad con ID " + id);
    }

    return await this.repository.actualizarOportunidad(id, datos);
  }

  // Eliminar una oportunidad
  async eliminarOportunidad(id: number): Promise<boolean> {
    return await this.repository.eliminarOportunidad(id);
  }
}