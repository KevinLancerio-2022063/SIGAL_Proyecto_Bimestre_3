// Interface para profesor (con JOINs de Usuario y Universidad)
export interface IProfesor {
  id_profesor: number;
  numero_empleado: string;
  departamento: string;
  especialidad: string;
  oficina: string;
  telefono_oficina: string;
  horas_tutoria: string;
  activo: number;
  fk_id_usuario: number;
  fk_id_universidad: number;
  // Campos adicionales del JOIN
  nombre?: string;
  email?: string;
  universidad?: string;
}

// Interface para crear un profesor
export interface ICrearProfesorDTO {
  fk_id_usuario: number;
  fk_id_universidad: number;
  numero_empleado: string;
  departamento: string;
  especialidad: string;
  oficina: string;
  telefono_oficina: string;
  horas_tutoria: string;
}

// Interface para actualizar un profesor
export interface IActualizarProfesorDTO {
  departamento?: string;
  especialidad?: string;
  activo?: number;
}