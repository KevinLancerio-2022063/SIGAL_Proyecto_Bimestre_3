import { pool } from './database';
import { IUsuario, ICrearUsuarioDTO, IActualizarUsuarioDTO } from '../models/usuario';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

export class UsuarioRepository {
  
  async listarUsuarios(): Promise<IUsuario[]> {
    const [rows] = await pool.query('CALL sp_listarUsuarios()') as [IUsuario[], any];
    return rows;
  }

  async buscarPorId(id: number): Promise<IUsuario | null> {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE id_usuario = ?', [id]) as [IUsuario[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  async crearUsuario(datos: ICrearUsuarioDTO): Promise<number> {
    const [result] = await pool.query(
      'CALL sp_agregarUsuario(?, ?, ?, ?)',
      [datos.nombre, datos.email, datos.contrasena, datos.tipo_usuario]
    ) as [ResultSetHeader, any];
    
    return result.insertId;
  }

  async actualizarUsuario(id: number, datos: IActualizarUsuarioDTO): Promise<boolean> {
    const [result] = await pool.query(
      'CALL sp_editarUsuario(?, ?, ?, ?, ?)',
      [id, datos.nombre || '', datos.email || '', datos.tipo_usuario || 'ESTUDIANTE', datos.activo !== undefined ? datos.activo : 1]
    ) as [ResultSetHeader, any];
    
    return result.affectedRows > 0;
  }

  async eliminarUsuario(id: number): Promise<boolean> {
    const [result] = await pool.query('CALL sp_eliminarUsuario(?)', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}