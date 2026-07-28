import { pool } from './database';
import { IProfesor, ICrearProfesorDTO, IActualizarProfesorDTO } from '../models/Profesor';
import { ResultSetHeader } from 'mysql2';

// Repositorio: ejecuta las consultas para la entidad Profesor
export class ProfesorRepository {
  
  // Listar todos los profesores con JOINs a Usuario y Universidad
  async listarProfesores(): Promise<IProfesor[]> {
    const [rows] = await pool.query('CALL sp_listarProfesores()') as [IProfesor[], any];
    return rows;
  }

  // Buscar un profesor por su ID
  async buscarPorId(id: number): Promise<IProfesor | null> {
    const [rows] = await pool.query('SELECT * FROM Profesor WHERE id_profesor = ?', [id]) as [IProfesor[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear un nuevo profesor
  async crearProfesor(datos: ICrearProfesorDTO): Promise<number> {
    await pool.query(
      "CALL sp_agregarProfesor(?, ?, ?, ?, ?, ?, ?, ?, @id)",
      [datos.fk_id_usuario, datos.fk_id_universidad, datos.numero_empleado, datos.departamento, datos.especialidad, datos.oficina, datos.telefono_oficina, datos.horas_tutoria]
    );
    
    const [rows] = await pool.query("SELECT @id as id") as [any[], any];
    return rows[0].id;
  }

  // Actualizar un profesor existente
  async actualizarProfesor(id: number, datos: IActualizarProfesorDTO): Promise<boolean> {
    const [result] = await pool.query(
      'CALL sp_editarProfesor(?, ?, ?, ?)',
      [id, datos.departamento || '', datos.especialidad || '', datos.activo !== undefined ? datos.activo : 1]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Eliminar un profesor
  async eliminarProfesor(id: number): Promise<boolean> {
    const [result] = await pool.query('CALL sp_eliminarProfesor(?)', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}