import { pool } from "./database";
import { IOportunidad, ICrearOportunidadDTO, IActualizarOportunidadDTO } from "../models/Oportunidad";
import { ResultSetHeader } from "mysql2";

export class OportunidadRepository {
  async listarOportunidades(): Promise<IOportunidad[]> {
    const [rows] = await pool.query("CALL sp_listarOportunidades()") as [IOportunidad[], any];
    return rows;
  }

  async buscarPorId(id: number): Promise<IOportunidad | null> {
    const [rows] = await pool.query("SELECT * FROM Oportunidad WHERE id_oportunidad = ?", [id]) as [IOportunidad[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  async crearOportunidad(datos: ICrearOportunidadDTO): Promise<number> {
    await pool.query(
      "CALL sp_agregarOportunidad(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @id)",
      [
        datos.titulo,
        datos.descripcion,
        datos.tipo,
        datos.fk_id_empleador,
        datos.fk_id_universidad,
        datos.publicado_por,
        datos.requisitos_principales, // ← Coincide con el SP y la tabla
        datos.salario,
        datos.duracion,
        datos.fecha_vencimiento
      ]
    );
    const [rows] = await pool.query("SELECT @id as id") as [any[], any];
    return rows[0].id;
  }

  async actualizarOportunidad(id: number, datos: IActualizarOportunidadDTO): Promise<boolean> {
    const [result] = await pool.query(
      "CALL sp_editarOportunidad(?, ?, ?)",
      [id, datos.titulo || "", datos.estado || "ACTIVA"]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  async eliminarOportunidad(id: number): Promise<boolean> {
    const [result] = await pool.query("CALL sp_eliminarOportunidad(?)", [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}