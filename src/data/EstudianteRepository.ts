import { pool } from './database';
import { IEstudiante, ICrearEstudianteDTO, IActualizarEstudianteDTO } from '../models/Estudiante';
import { ResultSetHeader } from 'mysql2';

// Repositorio: ejecuta las consultas para la entidad Estudiante
export class EstudianteRepository {
  
  // Listar todos los estudiantes con JOINs a Usuario y Universidad
  async listarEstudiantes(): Promise<IEstudiante[]> {
    const [rows] = await pool.query('CALL sp_listarEstudiantes()') as [IEstudiante[], any];
    return rows;
  }

  // Buscar un estudiante por su ID
  async buscarPorId(id: number): Promise<IEstudiante | null> {
    const [rows] = await pool.query('SELECT * FROM Estudiante WHERE id_estudiante = ?', [id]) as [IEstudiante[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear un nuevo estudiante
  async crearEstudiante(datos: ICrearEstudianteDTO): Promise<number> {
    const [result] = await pool.query(
      'CALL sp_agregarEstudiante(?, ?, ?, ?, ?, ?)',
      [datos.fk_id_usuario, datos.fk_id_universidad, datos.matricula, datos.carrera, datos.semestre, datos.codigo_interno]
    ) as [ResultSetHeader, any];
    return result.insertId;
  }

  // Actualizar un estudiante existente
  async actualizarEstudiante(id: number, datos: IActualizarEstudianteDTO): Promise<boolean> {
    const [result] = await pool.query(
      'CALL sp_editarEstudiante(?, ?, ?, ?)',
      [id, datos.carrera || '', datos.semestre || 1, datos.estado || 'ACTIVO']
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Eliminar un estudiante
  async eliminarEstudiante(id: number): Promise<boolean> {
    const [result] = await pool.query('CALL sp_eliminarEstudiante(?)', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}