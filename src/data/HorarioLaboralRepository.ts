import { pool } from "./database";
import { IHorarioLaboral, ICrearHorarioLaboralDTO, IActualizarHorarioLaboralDTO } from "../models/HorarioLaboral";
import { ResultSetHeader } from "mysql2";

// Repositorio: ejecuta las consultas para la entidad Horario_Laboral
export class HorarioLaboralRepository {
  
  // Listar horarios laborales de un estudiante específico
  async listarPorEstudiante(idEstudiante: number): Promise<IHorarioLaboral[]> {
    const [rows] = await pool.query("CALL sp_listarHorariosLaborales(?)", [idEstudiante]) as [IHorarioLaboral[], any];
    return rows;
  }

  // Buscar un horario por su ID
  async buscarPorId(id: number): Promise<IHorarioLaboral | null> {
    const [rows] = await pool.query("SELECT * FROM Horario_Laboral WHERE id_horario_laboral = ?", [id]) as [IHorarioLaboral[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear un nuevo horario laboral
    async crearHorarioLaboral(datos: ICrearHorarioLaboralDTO): Promise<number> {
    await pool.query(
        'CALL sp_agregarHorarioLaboral(?, ?, ?, ?, ?, ?, ?, ?, ?, @id)',
        [
        datos.fk_id_estudiante, datos.fk_id_empleador, datos.puesto,
        datos.departamento, datos.supervisor, datos.dia_semana,
        datos.hora_inicio, datos.hora_fin, datos.salario
        ]
    );
    
    const [rows] = await pool.query('SELECT @id as id') as [any[], any];
    return rows[0].id;
    }

  // Actualizar un horario laboral existente
  async actualizarHorarioLaboral(id: number, datos: IActualizarHorarioLaboralDTO): Promise<boolean> {
    const [result] = await pool.query(
      "CALL sp_editarHorarioLaboral(?, ?, ?, ?, ?)",
      [id, datos.dia_semana || "LUNES", datos.hora_inicio || "00:00:00", datos.hora_fin || "00:00:00", datos.estado || "ACTIVO"]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Eliminar un horario laboral
  async eliminarHorarioLaboral(id: number): Promise<boolean> {
    const [result] = await pool.query("CALL sp_eliminarHorarioLaboral(?)", [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}