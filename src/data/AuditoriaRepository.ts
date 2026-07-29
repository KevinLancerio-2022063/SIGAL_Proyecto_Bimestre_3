import { pool } from "./database";
import { IAuditoria, ICrearAuditoriaDTO } from "../models/Auditoria";
import { ResultSetHeader } from "mysql2";

// Repositorio: ejecuta las consultas para la entidad Auditoria
export class AuditoriaRepository {
  
  // Listar todos los registros de auditoría
  async listarAuditoria(): Promise<IAuditoria[]> {
    const [rows] = await pool.query("CALL sp_listarAuditoria()") as [IAuditoria[], any];
    return rows;
  }

  // Registrar un nuevo evento de auditoría
    async registrarAuditoria(datos: ICrearAuditoriaDTO): Promise<number> {
    await pool.query(
        'CALL sp_registrarAuditoria(?, ?, ?, ?, ?, @id)',
        [datos.tabla_afectada, datos.accion, datos.fk_id_usuario, datos.descripcion, datos.ip_origen]
    );
    
    const [rows] = await pool.query('SELECT @id as id') as [any[], any];
    return rows[0].id;
    }
}