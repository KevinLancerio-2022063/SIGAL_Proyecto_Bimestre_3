import { ask } from "../utils/readline";
import { EvaluacionService } from "../services/EvaluacionService";

const service = new EvaluacionService();

export const menuEvaluacion = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Evaluaciones ---");
        console.log("1. Listar por Curso");
        console.log("2. Buscar por ID");
        console.log("3. Crear nueva");
        console.log("4. Eliminar");
        console.log("5. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const idCurso = parseInt(await ask("ID del Curso: "));
                    const evaluaciones = await service.obtenerPorCurso(idCurso);
                    console.log("Evaluaciones encontradas: " + evaluaciones.length);
                    console.log(JSON.stringify(evaluaciones, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID de la evaluación: "));
                    const ev = await service.obtenerPorId(id);
                    console.log(ev ? JSON.stringify(ev, null, 2) : "No encontrada");
                    break;
                case "3":
                    const fk_id_curso = parseInt(await ask("ID del Curso (fk_id_curso): "));
                    const fk_id_profesor = parseInt(await ask("ID del Profesor (fk_id_profesor): "));
                    const tipo = await ask("Tipo (TAREA/PARTICIPACION/QUIZ/EXAMEN_PARCIAL/EXAMEN_FINAL/PROYECTO): ") as any;
                    const nombre = await ask("Nombre: ");
                    const descripcion = await ask("Descripción: ");
                    const puntaje_maximo = parseFloat(await ask("Puntaje máximo: "));
                    const porcentaje = parseFloat(await ask("Porcentaje: "));
                    const fecha_programada = await ask("Fecha programada (YYYY-MM-DD HH:MM:SS): ");
                    const fecha_entrega = await ask("Fecha entrega (YYYY-MM-DD HH:MM:SS): ");
                    
                    const newId = await service.crearEvaluacion({
                        fk_id_curso, fk_id_profesor, tipo, nombre, descripcion,
                        puntaje_maximo, porcentaje, fecha_programada, fecha_entrega
                    });
                    console.log("Evaluación creada con ID: " + newId);
                    break;
                case "4":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarEvaluacion(idDel);
                    console.log("Evaluación eliminada");
                    break;
                case "5":
                    back = true;
                    break;
                default:
                    console.log("Opción inválida");
            }
        } catch (error: any) {
            console.error("Error: " + error.message);
        }
    }
};