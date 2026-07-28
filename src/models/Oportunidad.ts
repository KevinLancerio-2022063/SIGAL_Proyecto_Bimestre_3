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

// Interface para crear una oportunidad
export interface ICrearOportunidadDTO {
  fk_id_empleador: number;
  fk_id_universidad: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  fecha_limite: string;
}

// Interface para actualizar una oportunidad
export interface IActualizarOportunidadDTO {
  titulo?: string;
  descripcion?: string;
  estado?: string;
}