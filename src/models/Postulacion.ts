// Interface para postulación
export interface IPostulacion {
  id_postulacion: number;
  fecha_postulacion: Date;
  estado: string;
  carta_presentacion: string;
  fk_id_estudiante: number;
  fk_id_oportunidad: number;
  // Campos adicionales del JOIN
  nombre_estudiante?: string;
  titulo_oportunidad?: string;
  nombre_empresa?: string;
}

// Interface para crear una postulación
export interface ICrearPostulacionDTO {
  fk_id_estudiante: number;
  fk_id_oportunidad: number;
  carta_presentacion: string;
}

// Interface para actualizar una postulación
export interface IActualizarPostulacionDTO {
  estado?: string;
}