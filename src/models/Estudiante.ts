// Interface para estudiante (con JOINs de Usuario y Universidad)
export interface IEstudiante {
  id_estudiante: number;
  matricula: string;
  carrera: string;
  semestre: number;
  promedio: number;
  promedio_general: number;
  estado: 'ACTIVO' | 'INACTIVO' | 'GRADUADO' | 'SUSPENDIDO';
  codigo_interno: string;
  fk_tutor_academico_id: number | null;
  ultima_actualizacion_promedio: Date | null;
  fk_id_usuario: number;
  fk_id_universidad: number;
  // Campos adicionales del JOIN
  nombre?: string;
  email?: string;
  universidad?: string;
}

// Interface para crear un estudiante
export interface ICrearEstudianteDTO {
  fk_id_usuario: number;
  fk_id_universidad: number;
  matricula: string;
  carrera: string;
  semestre: number;
  codigo_interno: string;
}

// Interface para actualizar un estudiante
export interface IActualizarEstudianteDTO {
  carrera?: string;
  semestre?: number;
  estado?: 'ACTIVO' | 'INACTIVO' | 'GRADUADO' | 'SUSPENDIDO';
}