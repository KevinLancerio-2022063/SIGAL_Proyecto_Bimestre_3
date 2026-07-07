// Clase base para errores personalizados de la aplicación
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error para validaciones fallidas (400)
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

// Error cuando un recurso no existe (404)
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

// Error cuando no hay autenticación válida (401)
export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

// Error cuando no hay permisos para acceder (403)
export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}