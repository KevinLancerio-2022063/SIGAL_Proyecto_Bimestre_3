// Interface para horario laboral
export interface IHorarioLaboral {
  id_horario_laboral: number;
  puesto: string;
  departamento: string;
  supervisor: string;
  dia_semana: "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";
  hora_inicio: string;
  hora_fin: string;
  salario: number;
  estado: "ACTIVO" | "INACTIVO" | "SUSPENDIDO";
  fk_id_estudiante: number;
  fk_id_empleador: number;
  // Campos adicionales del JOIN
  nombre_empresa?: string;
}

// Interface para crear un horario laboral
export interface ICrearHorarioLaboralDTO {
  fk_id_estudiante: number;
  fk_id_empleador: number;
  puesto: string;
  departamento: string;
  supervisor: string;
  dia_semana: "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";
  hora_inicio: string;
  hora_fin: string;
  salario: number;
}

// Interface para actualizar un horario laboral
export interface IActualizarHorarioLaboralDTO {
  dia_semana?: "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";
  hora_inicio?: string;
  hora_fin?: string;
  estado?: "ACTIVO" | "INACTIVO" | "SUSPENDIDO";
}