// Interface para evaluación completa
export interface IEvaluacion {
  id_evaluacion: number;
  comentario: string;
  calificacion: number;
  fecha: Date;
  fk_id_estudiante: number;
  fk_id_oportunidad: number;
  // Campos adicionales del JOIN
  nombre_estudiante?: string;
  titulo_oportunidad?: string;
}

// Interface para crear una evaluación
export interface ICrearEvaluacionDTO {
  comentario: string;
  calificacion: number;
  fk_id_estudiante: number;
  fk_id_oportunidad: number;
}

// Interface para actualizar una evaluación
export interface IActualizarEvaluacionDTO {
  comentario?: string;
  calificacion?: number;
}