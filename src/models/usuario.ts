// Interface para usuario completo (como viene de la BD)
export interface IUsuario {
  id_usuario: number;
  nombre: string;
  email: string;
  contrasena: string;
  tipo_usuario: 'ESTUDIANTE' | 'PROFESOR' | 'EMPLEADOR' | 'ADMIN';
  activo: number;
  fecha_registro: Date;
  ultimo_acceso: Date | null;
  foto: Date | null;
}

// Interface para crear usuario (sin id ni campos automáticos)
export interface ICrearUsuarioDTO {
  nombre: string;
  email: string;
  contrasena: string;
  tipo_usuario: 'ESTUDIANTE' | 'PROFESOR' | 'EMPLEADOR' | 'ADMIN';
}

// Interface para actualizar (todos opcionales)
export interface IActualizarUsuarioDTO {
  nombre?: string;
  email?: string;
  tipo_usuario?: 'ESTUDIANTE' | 'PROFESOR' | 'EMPLEADOR' | 'ADMIN';
  activo?: number;
}