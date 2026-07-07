import { ValidationError } from './errorHandler';

// Clase con métodos estáticos para validar datos comunes
export class Validators {
  // Validar que el email tenga formato correcto
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('El formato del correo no es válido');
    }
  }

  // Validar que un string no esté vacío
  static validateNotEmpty(value: string, fieldName: string): void {
    if (!value || value.trim() === '') {
      throw new ValidationError(`${fieldName} es obligatorio y no puede estar vacío`);
    }
  }

  // Validar que el teléfono tenga al menos 8 dígitos
  static validatePhone(phone: string): void {
    const phoneRegex = /^[0-9]{8,}$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
      throw new ValidationError('El teléfono debe contener al menos 8 dígitos');
    }
  }

  // Validar que el ID sea un número positivo
  static validateId(id: number): void {
    if (!id || isNaN(id) || id <= 0) {
      throw new ValidationError('El ID debe ser un número mayor a 0');
    }
  }

  // Validar que un valor esté en una lista permitida
  static validateEnum(value: string, allowedValues: string[], fieldName: string): void {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(
        `${fieldName} debe ser uno de: ${allowedValues.join(', ')}`
      );
    }
  }
}