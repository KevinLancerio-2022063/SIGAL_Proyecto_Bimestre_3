import { pool } from "./database";
import { IConflictoHorario, ICrearConflictoHorarioDTO, IResolverConflictoHorarioDTO } from "../models/ConflictoHorario";
import { ResultSetHeader } from "mysql2";

// Repositorio: ejecuta las consultas para la entidad Conflicto_Horario
export class ConflictoHorarioRepository {
  
  // Listar conflictos de un estudiante específico
  async listarPorEstudiante(idEstudiante: number): Promise<IConflictoHorario[]> {
    const [rows] = await pool.query("CALL sp_listarConflictos(?)", [idEstudiante]) as [IConflictoHorario[], any];
    return rows;
  }

  // Buscar un conflicto por su ID
  async buscarPorId(id: number): Promise<IConflictoHorario | null> {
    const [rows] = await pool.query("SELECT * FROM Conflicto_Horario WHERE id_conflicto = ?", [id]) as [IConflictoHorario[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Registrar un nuevo conflicto
    async registrarConflicto(datos: ICrearConflictoHorarioDTO): Promise<number> {
    await pool.query(
        'CALL sp_registrarConflicto(?, ?, ?, ?, ?, @id)',
        [
        datos.fk_id_estudiante, datos.fk_id_horario_academico,
        datos.fk_id_horario_laboral, datos.tipo_conflicto, datos.solucion_propuesta
        ]
    );
    
    const [rows] = await pool.query('SELECT @id as id') as [any[], any];
    return rows[0].id;
    }

  // Resolver un conflicto existente
  async resolverConflicto(id: number, datos: IResolverConflictoHorarioDTO): Promise<boolean> {
    const [result] = await pool.query(
      "CALL sp_resolverConflicto(?, ?, ?)",
      [id, datos.estado, datos.solucion_propuesta]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}