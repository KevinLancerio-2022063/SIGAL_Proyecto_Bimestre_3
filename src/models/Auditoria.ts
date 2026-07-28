// Interface para registro de auditoría
export interface IAuditoria {
  id_auditoria: number;
  tabla_afectada: string;
  accion: "INSERT" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  fk_id_usuario: number;
  descripcion: string;
  dato_anterior: string | null;
  dato_nuevo: string | null;
  ip_origen: string;
  fecha: Date;
  // Campos adicionales del JOIN
  usuario?: string;
  email?: string;
}

// Interface para registrar una nueva auditoría
export interface ICrearAuditoriaDTO {
  tabla_afectada: string;
  accion: "INSERT" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  fk_id_usuario: number;
  descripcion: string;
  ip_origen: string;
}