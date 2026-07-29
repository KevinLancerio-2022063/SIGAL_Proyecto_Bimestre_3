import { pool } from "./database";
import { IEvaluacion, ICrearEvaluacionDTO } from "../models/Evaluacion";
import { ResultSetHeader } from "mysql2";

export class EvaluacionRepository {
  async listarPorCurso(idCurso: number): Promise<IEvaluacion[]> {
    const [rows] = await pool.query("CALL sp_listarEvaluaciones(?)", [idCurso]) as [IEvaluacion[], any];
    return rows;
  }

  async buscarPorId(id: number): Promise<IEvaluacion | null> {
    const [rows] = await pool.query("SELECT * FROM Evaluacion WHERE id_evaluacion = ?", [id]) as [IEvaluacion[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  async crearEvaluacion(datos: ICrearEvaluacionDTO): Promise<number> {
    await pool.query(
      "CALL sp_agregarEvaluacion(?, ?, ?, ?, ?, ?, ?, ?, ?, @id)",
      [datos.fk_id_curso, datos.fk_id_profesor, datos.tipo, datos.nombre, datos.descripcion, datos.puntaje_maximo, datos.porcentaje, datos.fecha_programada, datos.fecha_entrega]
    );
    const [rows] = await pool.query("SELECT @id as id") as [any[], any];
    return rows[0].id;
  }

  async eliminarEvaluacion(id: number): Promise<boolean> {
    const [result] = await pool.query("CALL sp_eliminarEvaluacion(?)", [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}