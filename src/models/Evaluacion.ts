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

export interface ICrearEvaluacionDTO {
  fk_id_curso: number;
  fk_id_profesor: number;
  tipo: "TAREA" | "PARTICIPACION" | "QUIZ" | "EXAMEN_PARCIAL" | "EXAMEN_FINAL" | "PROYECTO";
  nombre: string;
  descripcion: string;
  puntaje_maximo: number;
  porcentaje: number;
  fecha_programada: string; // o Date
  fecha_entrega: string; // o Date
}

// Interface para actualizar una evaluación
export interface IActualizarEvaluacionDTO {
  comentario?: string;
  calificacion?: number;
}