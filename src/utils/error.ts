// Error personalizado para recursos no encontrados
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Error personalizado para validación
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Error personalizado para autorización
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// Error personalizado para conflicto
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

// Helper para manejar errores de base de datos
export const handleDatabaseError = (error: any): Error => {
  if (error.code === 'ER_DUP_ENTRY') {
    return new ValidationError('El registro ya existe');
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new NotFoundError('La referencia no existe');
  }
  return new Error('Error en la base de datos');
};