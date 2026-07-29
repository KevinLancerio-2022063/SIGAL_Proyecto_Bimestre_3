import { pool } from "./database";
import { ICurso, ICrearCursoDTO, IActualizarCursoDTO } from "../models/Curso";
import { ResultSetHeader } from "mysql2";

// Repositorio: ejecuta las consultas para la entidad Curso
export class CursoRepository {
  
  // Listar todos los cursos con JOINs
  async listarCursos(): Promise<ICurso[]> {
    const [rows] = await pool.query("CALL sp_listarCursos()") as [ICurso[], any];
    return rows;
  }

  // Buscar un curso por su ID
  async buscarPorId(id: number): Promise<ICurso | null> {
    const [rows] = await pool.query("SELECT * FROM Curso WHERE id_curso = ?", [id]) as [ICurso[], any];
    return rows.length > 0 ? rows[0] : null;
  }

  // Crear un nuevo curso
  async crearCurso(datos: ICrearCursoDTO): Promise<number> {
    await pool.query(
      'CALL sp_agregarCurso(?, ?, ?, ?, ?, ?, ?, ?, ?, @id)',
      [
        datos.codigo_curso, datos.nombre, datos.descripcion, datos.creditos,
        datos.horas, datos.fk_id_profesor, datos.fk_id_universidad,
        datos.modalidad, datos.semestre
      ]
    );
    
    const [rows] = await pool.query('SELECT @id as id') as [any[], any];
    return rows[0].id;
  }

  // Actualizar un curso existente
  async actualizarCurso(id: number, datos: IActualizarCursoDTO): Promise<boolean> {
    const [result] = await pool.query(
      "CALL sp_editarCurso(?, ?, ?, ?)",
      [id, datos.nombre || "", datos.creditos || 3, datos.modalidad || "PRESENCIAL"]
    ) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Eliminar un curso
  async eliminarCurso(id: number): Promise<boolean> {
    const [result] = await pool.query("CALL sp_eliminarCurso(?)", [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }
}