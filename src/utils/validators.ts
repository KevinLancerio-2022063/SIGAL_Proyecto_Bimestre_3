// Validar formato de email
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar longitud mínima
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Validar que no esté vacío
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validar número positivo
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

// Validar tipo de usuario
export const isValidTipoUsuario = (tipo: string): boolean => {
  return ['ESTUDIANTE', 'PROFESOR', 'EMPLEADOR', 'ADMIN'].includes(tipo);
};