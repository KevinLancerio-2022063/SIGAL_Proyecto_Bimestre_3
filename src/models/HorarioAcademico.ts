// Interface para horario académico
export interface IHorarioAcademico {
  id_horario_academico: number;
  dia_semana: "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";
  hora_inicio: string;
  hora_fin: string;
  aula: string;
  semestre: string;
  anio: number;
  fk_id_estudiante: number;
  fk_id_curso: number;
  // Campos adicionales del JOIN
  curso?: string;
  codigo_curso?: string;
}

// Interface para crear un horario académico
export interface ICrearHorarioAcademicoDTO {
  fk_id_estudiante: number;
  fk_id_curso: number;
  dia_semana: "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";
  hora_inicio: string;
  hora_fin: string;
  aula: string;
  semestre: string;
  anio: number;
}