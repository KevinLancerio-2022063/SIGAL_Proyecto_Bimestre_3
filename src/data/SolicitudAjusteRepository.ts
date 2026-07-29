import { pool } from "./database";
import { ISolicitudAjuste, ICrearSolicitudAjusteDTO, IResolverSolicitudAjusteDTO } from "../models/SolicitudAjuste";
import { ResultSetHeader } from "mysql2";

// Repositorio: ejecuta las consultas para la entidad Solicitud_Ajuste
export class SolicitudAjusteRepository {
  
  // Listar solicitudes de un estudiante específico
  async listarPorEstudiante(idEstudiante: number): Promise<ISolicitudAjuste[]> {
    const [rows] = await pool.query("CALL sp_listarSolicitudes(?)", [idEstudiante]) as [ISolicitudAjuste[], any];
    return rows;
  }

  // Buscar una solicitud por su ID
  async buscarPorId(id: number): Promise<ISolicitudAjuste | null> {
    const [rows] = await pool.query("SELECT * FROM Solicitud_Ajuste WHERE id_solicitud = ?", [id]) as [ISolicitudAjuste[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Agregar una nueva solicitud
  async agregarSolicitud(datos: ICrearSolicitudAjusteDTO): Promise<number> {
    await pool.query(
      "CALL sp_agregarSolicitud(?, ?, ?, ?, ?, ?, @id)",
      [
        datos.fk_id_estudiante, datos.tipo, datos.descripcion,
        datos.justificacion, datos.fk_id_profesor, datos.fk_id_empleador
      ]
    );
    
    const [rows] = await pool.query("SELECT @id as id") as [any[], any];
    return rows[0].id;
  }

  // Resolver una solicitud existente
  async resolverSolicitud(id: number, datos: IResolverSolicitudAjusteDTO): Promise<boolean> {
    const [result] = await pool.query(
      "CALL sp_resolverSolicitud(?, ?, ?)",
      [id, datos.estado, datos.justificacion]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}