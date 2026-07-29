import { pool } from "./database";
import { IHorarioAcademico, ICrearHorarioAcademicoDTO } from "../models/HorarioAcademico";
import { ResultSetHeader } from "mysql2";

// Repositorio: ejecuta las consultas para la entidad Horario_Academico
export class HorarioAcademicoRepository {
  
  // Listar horarios académicos de un estudiante específico
  async listarPorEstudiante(idEstudiante: number): Promise<IHorarioAcademico[]> {
    const [rows] = await pool.query("CALL sp_listarHorariosAcademicos(?)", [idEstudiante]) as [IHorarioAcademico[], any];
    return rows;
  }

  // Buscar un horario por su ID
  async buscarPorId(id: number): Promise<IHorarioAcademico | null> {
    const [rows] = await pool.query("SELECT * FROM Horario_Academico WHERE id_horario_academico = ?", [id]) as [IHorarioAcademico[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear un nuevo horario académico
    async crearHorarioAcademico(datos: ICrearHorarioAcademicoDTO): Promise<number> {
    await pool.query(
        'CALL sp_agregarHorarioAcademico(?, ?, ?, ?, ?, ?, ?, ?, @id)',
        [
        datos.fk_id_estudiante, datos.fk_id_curso, datos.dia_semana,
        datos.hora_inicio, datos.hora_fin, datos.aula, datos.semestre, datos.anio
        ]
    );
    
    const [rows] = await pool.query('SELECT @id as id') as [any[], any];
    return rows[0].id;
    }

  // Eliminar un horario académico
  async eliminarHorarioAcademico(id: number): Promise<boolean> {
    const [result] = await pool.query("CALL sp_eliminarHorarioAcademico(?)", [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}