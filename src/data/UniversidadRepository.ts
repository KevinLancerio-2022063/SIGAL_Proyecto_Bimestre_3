import { pool } from './database';
import { IUniversidad, ICrearUniversidadDTO, IActualizarUniversidadDTO } from '../models/Universidad';
import { ResultSetHeader } from 'mysql2';

// Repositorio: ejecuta las consultas a la base de datos para Universidad
export class UniversidadRepository {
  
  // Listar todas las universidades
  async listarUniversidades(): Promise<IUniversidad[]> {
    const [rows] = await pool.query('CALL sp_listarUniversidades()') as [IUniversidad[], any];
    return rows;
  }

  // Buscar una universidad por su ID
  async buscarPorId(id: number): Promise<IUniversidad | null> {
    const [rows] = await pool.query('SELECT * FROM Universidad WHERE id_universidad = ?', [id]) as [IUniversidad[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  async crearUniversidad(datos: ICrearUniversidadDTO): Promise<number> {
    await pool.query(
      'CALL sp_agregarUniversidad(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @id)',
      [
        datos.nombre, datos.sigla, datos.ubicacion, datos.ciudad, datos.pais,
        datos.telefono, datos.email, datos.sitio_web, datos.rectora,
        datos.codigo_institucional, datos.imagen_logo, datos.acreditacion, datos.tipos_programa
      ]
    );
    
    const [rows] = await pool.query('SELECT @id as id') as [any[], any];
    return rows[0].id;
  }

  // Actualizar una universidad existente
  async actualizarUniversidad(id: number, datos: IActualizarUniversidadDTO): Promise<boolean> {
    const [result] = await pool.query(
      'CALL sp_editarUniversidad(?, ?, ?, ?, ?)',
      [id, datos.nombre || '', datos.sigla || '', datos.ciudad || '', datos.estado || 'ACTIVA']
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Eliminar una universidad
  async eliminarUniversidad(id: number): Promise<boolean> {
    const [result] = await pool.query('CALL sp_eliminarUniversidad(?)', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}