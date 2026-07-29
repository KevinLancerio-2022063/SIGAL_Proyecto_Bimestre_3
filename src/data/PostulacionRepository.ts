import { pool } from "./database";
import { IPostulacion, ICrearPostulacionDTO, IActualizarPostulacionDTO } from "../models/Postulacion";
import { ResultSetHeader } from "mysql2";

export class PostulacionRepository {
  async listarPorEstudiante(idEstudiante: number): Promise<IPostulacion[]> {
    const [rows] = await pool.query("CALL sp_listarPostulaciones(?)", [idEstudiante]) as [IPostulacion[], any];
    return rows;
  }

  async buscarPorId(id: number): Promise<IPostulacion | null> {
    const [rows] = await pool.query("SELECT * FROM Postulacion WHERE id_postulacion = ?", [id]) as [IPostulacion[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  async crearPostulacion(datos: ICrearPostulacionDTO): Promise<number> {
    await pool.query(
      "CALL sp_agregarPostulacion(?, ?, ?, ?, ?, @id)",
      [datos.fk_id_estudiante, datos.fk_id_oportunidad, datos.carta_motivacion, datos.curriculum_url, datos.porcentaje_compatibilidad]
    );
    const [rows] = await pool.query("SELECT @id as id") as [any[], any];
    return rows[0].id;
  }

  async actualizarEstadoPostulacion(id: number, datos: IActualizarPostulacionDTO): Promise<boolean> {
    const [result] = await pool.query(
      "CALL sp_actualizarEstadoPostulacion(?, ?, ?)",
      [id, datos.estado || "PENDIENTE", datos.comentarios_revisor || ""]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}