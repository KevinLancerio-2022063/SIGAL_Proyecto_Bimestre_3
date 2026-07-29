import { AuditoriaRepository } from "../data/AuditoriaRepository";
import { IAuditoria, ICrearAuditoriaDTO } from "../models/Auditoria";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Auditoria
export class AuditoriaService {
  private repository: AuditoriaRepository;

  constructor() {
    this.repository = new AuditoriaRepository();
  }

  // Obtener todos los registros de auditoría
  async obtenerTodos(): Promise<IAuditoria[]> {
    return await this.repository.listarAuditoria();
  }

  // Registrar un nuevo evento con validaciones
  async registrarAuditoria(datos: ICrearAuditoriaDTO): Promise<number> {
    if (!isNotEmpty(datos.tabla_afectada)) {
      throw new ValidationError("La tabla afectada es obligatoria");
    }

    if (!isNotEmpty(datos.descripcion)) {
      throw new ValidationError("La descripción es obligatoria");
    }

    if (!isNotEmpty(datos.ip_origen)) {
      throw new ValidationError("La IP de origen es obligatoria");
    }

    if (datos.fk_id_usuario <= 0) {
      throw new ValidationError("El ID del usuario es inválido");
    }

    return await this.repository.registrarAuditoria(datos);
  }
}