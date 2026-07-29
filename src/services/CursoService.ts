import { CursoRepository } from "../data/CursoRepository";
import { ICurso, ICrearCursoDTO, IActualizarCursoDTO } from "../models/Curso";
import { isNotEmpty } from "../utils/validators";
import { ValidationError } from "../utils/error";

// Servicio: lógica de negocio y validaciones para Curso
export class CursoService {
  private repository: CursoRepository;

  constructor() {
    this.repository = new CursoRepository();
  }

  // Obtener todos los cursos
  async obtenerTodos(): Promise<ICurso[]> {
    return await this.repository.listarCursos();
  }

  // Obtener un curso por su ID
  async obtenerPorId(id: number): Promise<ICurso | null> {
    if (id <= 0) {
      throw new ValidationError("El ID debe ser un número positivo");
    }
    return await this.repository.buscarPorId(id);
  }

  // Crear un nuevo curso con validaciones
  async crearCurso(datos: ICrearCursoDTO): Promise<number> {
    if (!isNotEmpty(datos.codigo_curso)) {
      throw new ValidationError("El código del curso es obligatorio");
    }

    if (!isNotEmpty(datos.nombre)) {
      throw new ValidationError("El nombre del curso es obligatorio");
    }

    if (datos.creditos <= 0) {
      throw new ValidationError("Los créditos deben ser mayores a 0");
    }

    if (datos.fk_id_profesor <= 0) {
      throw new ValidationError("El ID del profesor es inválido");
    }

    if (datos.fk_id_universidad <= 0) {
      throw new ValidationError("El ID de la universidad es inválido");
    }

    return await this.repository.crearCurso(datos);
  }

  // Actualizar un curso existente
  async actualizarCurso(id: number, datos: IActualizarCursoDTO): Promise<boolean> {
    const cursoExistente = await this.repository.buscarPorId(id);
    if (!cursoExistente) {
      throw new ValidationError("No existe un curso con ID " + id);
    }

    return await this.repository.actualizarCurso(id, datos);
  }

  // Eliminar un curso
  async eliminarCurso(id: number): Promise<boolean> {
    return await this.repository.eliminarCurso(id);
  }
}