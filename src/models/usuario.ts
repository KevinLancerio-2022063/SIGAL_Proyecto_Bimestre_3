// Interface base para todos los usuarios del sistema
export interface IUsuario {
  id_usuario: number;
  nombre: string;
  email: string;
  contraseña: string;
  tipo_usuario: 'ESTUDIANTE' | 'PROFESOR' | 'EMPLEADOR' | 'ADMIN';
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

// Interface para estudiantes (extiende IUsuario)
export interface IEstudiante extends IUsuario {
  fk_id_universidad: number;
  matricula: string;
  carrera: string;
  semestre: number;
  codigo_interno: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'GRADUADO' | 'SUSPENDIDO';
  fk_tutor_academico_id: number | null;
}

// Interface para profesores (extiende IUsuario)
export interface IProfesor extends IUsuario {
  fk_id_universidad: number;
  numero_empleado: string;
  departamento: string;
  especialidad: string;
  oficina: string;
  telefono_oficina: string;
  horas_tutoria: string;
}

// Interface para empleadores (extiende IUsuario)
export interface IEmpleador extends IUsuario {
  nombre_empresa: string;
  nit: string;
  sector: string;
  ubicacion: string;
  telefono_empresa: string;
  sitio_web: string;
  numero_empleados: number;
  representante_legal: string;
}

// Interface para universidades
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
  imagen_logo: string;
  acreditacion: string;
  tipos_programa: string;
  estado: 'ACTIVA' | 'INACTIVA';
}

// Interface para cursos
export interface ICurso {
  id_curso: number;
  codigo_curso: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  horas: number;
  fk_id_profesor: number;
  fk_id_universidad: number;
  modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDO';
  semestre: string;
}