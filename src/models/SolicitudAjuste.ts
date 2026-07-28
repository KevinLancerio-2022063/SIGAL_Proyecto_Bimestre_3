// Interface para solicitud de ajuste
export interface ISolicitudAjuste {
  id_solicitud: number;
  tipo: "CAMBIO_HORARIO" | "PERMISO_LABORAL" | "EXTENSION_ENTREGA" | "OTRO";
  descripcion: string;
  fecha_solicitud: Date;
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "EN_REVISION";
  requiere_aprobacion: number;
  fecha_resolucion: Date | null;
  justificacion: string;
  fk_id_estudiante: number;
  fk_id_profesor: number | null;
  fk_id_empleador: number | null;
}

// Interface para crear una solicitud de ajuste
export interface ICrearSolicitudAjusteDTO {
  fk_id_estudiante: number;
  tipo: "CAMBIO_HORARIO" | "PERMISO_LABORAL" | "EXTENSION_ENTREGA" | "OTRO";
  descripcion: string;
  justificacion: string;
  fk_id_profesor: number | null;
  fk_id_empleador: number | null;
}

// Interface para resolver una solicitud de ajuste
export interface IResolverSolicitudAjusteDTO {
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "EN_REVISION";
  justificacion: string;
}