import { ask } from "../utils/readline";
import { CalificacionService } from "../services/CalificacionService";

const service = new CalificacionService();

// Menú CRUD para Calificaciones
export const menuCalificacion = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Calificaciones ---");
        console.log("1. Listar por Estudiante");
        console.log("2. Buscar por ID");
        console.log("3. Crear nueva");
        console.log("4. Actualizar");
        console.log("5. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const idEst = parseInt(await ask("ID del Estudiante: "));
                    const calificaciones = await service.obtenerPorEstudiante(idEst);
                    console.log("Calificaciones encontradas: " + calificaciones.length);
                    console.log(JSON.stringify(calificaciones, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID de la calificación: "));
                    const cal = await service.obtenerPorId(id);
                    console.log(cal ? JSON.stringify(cal, null, 2) : "No encontrada");
                    break;
                case "3":
                    const fk_id_evaluacion = parseInt(await ask("ID de la Evaluación (fk_id_evaluacion): "));
                    const fk_id_estudiante = parseInt(await ask("ID del Estudiante (fk_id_estudiante): "));
                    const puntaje = parseFloat(await ask("Puntaje obtenido: "));
                    const observaciones = await ask("Observaciones: ");
                    const retroalimentacion = await ask("Retroalimentación: ");
                    const fk_id_profesor = parseInt(await ask("ID del Profesor (fk_id_profesor): "));
                    
                    const newId = await service.crearCalificacion({
                        fk_id_evaluacion, fk_id_estudiante, puntaje_obtenido: puntaje,
                        observaciones, retroalimentacion, fk_id_profesor
                    });
                    console.log("Calificación creada con ID: " + newId);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const puntajeUpd = parseFloat(await ask("Puntaje obtenido: "));
                    const retroUpd = await ask("Retroalimentación: ");
                    const estadoUpd = await ask("Estado (CALIFICADA/REVISANDO/IMPUGNADA): ") as any;
                    
                    await service.actualizarCalificacion(idUpd, {
                        puntaje_obtenido: puntajeUpd,
                        retroalimentacion: retroUpd,
                        estado: estadoUpd
                    });
                    console.log("Calificación actualizada");
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