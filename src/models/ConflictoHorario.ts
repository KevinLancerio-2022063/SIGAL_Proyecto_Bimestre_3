// Interface para conflicto horario
export interface IConflictoHorario {
  id_conflicto: number;
  tipo_conflicto: "SUPERPOSICION" | "CARGA_EXCESIVA" | "VIAJE_LARGO";
  fecha_detectada: Date;
  estado: "PENDIENTE" | "EN_PROCESO" | "RESUELTO" | "IGNORADO";
  solucion_propuesta: string;
  fk_id_estudiante: number;
  fk_id_horario_academico: number | null;
  fk_id_horario_laboral: number | null;
}

// Interface para crear un conflicto horario
export interface ICrearConflictoHorarioDTO {
  fk_id_estudiante: number;
  fk_id_horario_academico: number | null;
  fk_id_horario_laboral: number | null;
  tipo_conflicto: "SUPERPOSICION" | "CARGA_EXCESIVA" | "VIAJE_LARGO";
  solucion_propuesta: string;
}

// Interface para resolver un conflicto horario
export interface IResolverConflictoHorarioDTO {
  estado: "PENDIENTE" | "EN_PROCESO" | "RESUELTO" | "IGNORADO";
  solucion_propuesta: string;
}