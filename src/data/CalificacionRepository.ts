import { pool } from "./database";
import { ICalificacion, ICrearCalificacionDTO, IActualizarCalificacionDTO } from "../models/Calificacion";
import { ResultSetHeader } from "mysql2";

// Repositorio: ejecuta las consultas para la entidad Calificacion
export class CalificacionRepository {
  
  // Listar calificaciones de un estudiante específico
  async listarPorEstudiante(idEstudiante: number): Promise<ICalificacion[]> {
    const [rows] = await pool.query("CALL sp_listarCalificacionesPorEstudiante(?)", [idEstudiante]) as [ICalificacion[], any];
    return rows;
  }

  // Buscar una calificación por su ID
  async buscarPorId(id: number): Promise<ICalificacion | null> {
    const [rows] = await pool.query("SELECT * FROM Calificacion WHERE id_calificacion = ?", [id]) as [ICalificacion[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear una nueva calificación
    async crearCalificacion(datos: ICrearCalificacionDTO): Promise<number> {
    await pool.query(
        'CALL sp_agregarCalificacion(?, ?, ?, ?, ?, ?, @id)',
        [
        datos.fk_id_evaluacion, datos.fk_id_estudiante, datos.puntaje_obtenido,
        datos.observaciones, datos.retroalimentacion, datos.fk_id_profesor
        ]
    );
    
    const [rows] = await pool.query('SELECT @id as id') as [any[], any];
    return rows[0].id;
    }

  // Actualizar una calificación existente
  async actualizarCalificacion(id: number, datos: IActualizarCalificacionDTO): Promise<boolean> {
    const [result] = await pool.query(
      "CALL sp_editarCalificacion(?, ?, ?, ?)",
      [id, datos.puntaje_obtenido || 0, datos.retroalimentacion || "", datos.estado || "CALIFICADA"]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}