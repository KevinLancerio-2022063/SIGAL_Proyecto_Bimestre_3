// Interface para universidad
export interface IUniversidad {
  id_universidad: number;
  nombre: string;
  sigla: string;
  ubicacion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  email: string;
  sitio_web: string;
  rectora: string;
  codigo_institucional: string;
  estado: 'ACTIVA' | 'INACTIVA';
  fecha_registro: Date;
  imagen_logo: string;
  acreditacion: string;
  tipos_programa: string;
}

// Interface para crear universidad
export interface ICrearUniversidadDTO {
  nombre: string;
  sigla: string;
  ubicacion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  email: string;
  sitio_web: string;
  rectora: string;
  codigo_institucional: string;
  imagen_logo: string;
  acreditacion: string;
  tipos_programa: string;
}

// Interface para actualizar universidad
export interface IActualizarUniversidadDTO {
  nombre?: string;
  sigla?: string;
  ciudad?: string;
  estado?: 'ACTIVA' | 'INACTIVA';
}