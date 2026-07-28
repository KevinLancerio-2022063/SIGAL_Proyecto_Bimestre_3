// Interface para empleador
export interface IEmpleador {
  id_empleador: number;
  nombre_empresa: string;
  nit: string;
  sector: string;
  ubicacion: string;
  telefono_empresa: string;
  sitio_web: string;
  numero_empleados: number;
  representante_legal: string;
  fk_id_usuario: number;
  // Campos adicionales del JOIN
  nombre?: string;
  email?: string;
}

// Interface para crear un empleador
export interface ICrearEmpleadorDTO {
  fk_id_usuario: number;
  nombre_empresa: string;
  nit: string;
  sector: string;
  ubicacion: string;
  telefono_empresa: string;
  sitio_web: string;
  numero_empleados: number;
  representante_legal: string;
}

// Interface para actualizar un empleador
export interface IActualizarEmpleadorDTO {
  nombre_empresa?: string;
  sector?: string;
  ubicacion?: string;
}