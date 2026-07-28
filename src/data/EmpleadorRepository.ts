import { pool } from './database';
import { IEmpleador, ICrearEmpleadorDTO, IActualizarEmpleadorDTO } from '../models/Empleador';
import { ResultSetHeader } from 'mysql2';

// Repositorio: ejecuta las consultas para la entidad Empleador
export class EmpleadorRepository {
  
  // Listar todos los empleadores con JOIN a Usuario
  async listarEmpleadores(): Promise<IEmpleador[]> {
    const [rows] = await pool.query('CALL sp_listarEmpleadores()') as [IEmpleador[], any];
    return rows;
  }

  // Buscar un empleador por su ID
  async buscarPorId(id: number): Promise<IEmpleador | null> {
    const [rows] = await pool.query('SELECT * FROM Empleador WHERE id_empleador = ?', [id]) as [IEmpleador[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear un nuevo empleador
  async crearEmpleador(datos: ICrearEmpleadorDTO): Promise<number> {
    await pool.query(
      "CALL sp_agregarEmpleador(?, ?, ?, ?, ?, ?, ?, ?, ?, @id)",
      [
        datos.fk_id_usuario, datos.nombre_empresa, datos.nit, datos.sector,
        datos.ubicacion, datos.telefono_empresa, datos.sitio_web,
        datos.numero_empleados, datos.representante_legal
      ]
    );
    
    const [rows] = await pool.query("SELECT @id as id") as [any[], any];
    return rows[0].id;
  }

  // Actualizar un empleador existente
  async actualizarEmpleador(id: number, datos: IActualizarEmpleadorDTO): Promise<boolean> {
    const [result] = await pool.query(
      'CALL sp_editarEmpleador(?, ?, ?, ?)',
      [id, datos.nombre_empresa || '', datos.sector || '', datos.ubicacion || '']
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Eliminar un empleador
  async eliminarEmpleador(id: number): Promise<boolean> {
    const [result] = await pool.query('CALL sp_eliminarEmpleador(?)', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}