// Interface para curso
export interface ICurso {
  id_curso: number;
  codigo_curso: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  horas: number;
  capacidad_maxima: number;
  modalidad: "PRESENCIAL" | "VIRTUAL" | "HIBRIDO";
  semestre: string;
  fk_id_profesor: number;
  fk_id_universidad: number;
  // Campos adicionales del JOIN
  nombre_profesor?: string;
  universidad?: string;
}

// Interface para crear un curso
export interface ICrearCursoDTO {
  codigo_curso: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  horas: number;
  fk_id_profesor: number;
  fk_id_universidad: number;
  modalidad: "PRESENCIAL" | "VIRTUAL" | "HIBRIDO";
  semestre: string;
}

// Interface para actualizar un curso
export interface IActualizarCursoDTO {
  nombre?: string;
  creditos?: number;
  modalidad?: "PRESENCIAL" | "VIRTUAL" | "HIBRIDO";
}