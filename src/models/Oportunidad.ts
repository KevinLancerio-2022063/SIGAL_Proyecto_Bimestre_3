// Interface para oportunidad
export interface IOportunidad {
  id_oportunidad: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: string;
  fecha_publicacion: Date;
  fecha_limite: Date;
  fk_id_empleador: number;
  fk_id_universidad: number;
  // Campos adicionales del JOIN
  nombre_empresa?: string;
  nombre_universidad?: string;
}

export interface ICrearOportunidadDTO {
  titulo: string;
  descripcion: string;
  tipo: "BECA" | "PASANTIA" | "EMPLEO" | "PROGRAMA_INTERCAMBIO";
  fk_id_empleador: number;
  fk_id_universidad: number;
  publicado_por: "EMPLEADOR" | "UNIVERSIDAD" | "ADMIN";
  requisitos_principales: string; // ← Este es el nombre correcto según tu tabla
  salario: number;
  duracion: string;
  fecha_vencimiento: string; // o Date
}

export interface IActualizarOportunidadDTO {
  titulo?: string;
  estado?: "ACTIVA" | "CERRADA" | "PAUSADA" | "VENCIDA";
}