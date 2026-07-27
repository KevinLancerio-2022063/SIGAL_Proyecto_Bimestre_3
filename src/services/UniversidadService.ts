import { UniversidadRepository } from '../data/UniversidadRepository';
import { IUniversidad, ICrearUniversidadDTO, IActualizarUniversidadDTO } from '../models/Universidad';
import { isValidEmail, isNotEmpty } from '../utils/validators';
import { ValidationError } from '../utils/error';

// Servicio: contiene la lógica de negocio y validaciones para Universidad
export class UniversidadService {
  private repository: UniversidadRepository;

  constructor() {
    this.repository = new UniversidadRepository();
  }

  // Obtener todas las universidades
  async obtenerTodas(): Promise<IUniversidad[]> {
    return await this.repository.listarUniversidades();
  }

  // Obtener una universidad por su ID
  async obtenerPorId(id: number): Promise<IUniversidad | null> {
    if (id <= 0) {
      throw new ValidationError('El ID debe ser un número positivo');
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear una nueva universidad con validaciones
  async crearUniversidad(datos: ICrearUniversidadDTO): Promise<number> {
    // Validamos que el nombre no esté vacío
    if (!isNotEmpty(datos.nombre)) {
      throw new ValidationError('El nombre es obligatorio');
    }

    // Validamos que la sigla no esté vacía
    if (!isNotEmpty(datos.sigla)) {
      throw new ValidationError('La sigla es obligatoria');
    }

    // Validamos que el email tenga formato correcto
    if (!isValidEmail(datos.email)) {
      throw new ValidationError('El email no tiene un formato válido');
    }

    // Validamos que la ciudad no esté vacía
    if (!isNotEmpty(datos.ciudad)) {
      throw new ValidationError('La ciudad es obligatoria');
    }

    // Creamos la universidad en la base de datos
    return await this.repository.crearUniversidad(datos);
  }

    async actualizarUniversidad(id: number, datos: IActualizarUniversidadDTO): Promise<boolean> {
    const universidadExistente = await this.repository.buscarPorId(id);
    if (!universidadExistente) {
        throw new ValidationError(`No existe una universidad con ID ${id}`);
    }

    return await this.repository.actualizarUniversidad(id, datos);
    }


  // Eliminar una universidad
  async eliminarUniversidad(id: number): Promise<boolean> {
    return await this.repository.eliminarUniversidad(id);
  }
}