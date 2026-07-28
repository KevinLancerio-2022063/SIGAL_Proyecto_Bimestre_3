// Interface para postulación
export interface IPostulacion {
  id_postulacion: number;
  fecha_postulacion: Date;
  estado: string;
  carta_presentacion: string;
  fk_id_estudiante: number;
  fk_id_oportunidad: number;
  // Campos adicionales del JOIN
  nombre_estudiante?: string;
  titulo_oportunidad?: string;
  nombre_empresa?: string;
}

export interface ICrearPostulacionDTO {
  fk_id_estudiante: number;
  fk_id_oportunidad: number;
  carta_motivacion: string;
  curriculum_url: string;
  porcentaje_compatibilidad: number;
}

export interface IActualizarPostulacionDTO {
  estado?: "PENDIENTE" | "EN_REVISION" | "PRESELECCIONADO" | "ENTREVISTA" | "ACEPTADO" | "RECHAZADO" | "RETIRADO";
  comentarios_revisor?: string;
}