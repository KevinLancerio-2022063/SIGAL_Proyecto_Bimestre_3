// Interface para calificación
export interface ICalificacion {
  id_calificacion: number;
  puntaje_obtenido: number;
  observaciones: string;
  retroalimentacion: string;
  fecha_calificacion: Date;
  estado: "CALIFICADA" | "REVISANDO" | "IMPUGNADA";
  fk_id_evaluacion: number;
  fk_id_estudiante: number;
  fk_id_profesor: number;
  // Campos adicionales del JOIN
  evaluacion?: string;
  tipo?: string;
  porcentaje?: number;
  curso?: string;
}

// Interface para crear una calificación
export interface ICrearCalificacionDTO {
  fk_id_evaluacion: number;
  fk_id_estudiante: number;
  puntaje_obtenido: number;
  observaciones: string;
  retroalimentacion: string;
  fk_id_profesor: number;
}

// Interface para actualizar una calificación
export interface IActualizarCalificacionDTO {
  puntaje_obtenido?: number;
  retroalimentacion?: string;
  estado?: "CALIFICADA" | "REVISANDO" | "IMPUGNADA";
}