import { ask } from "../utils/readline";
import { PostulacionService } from "../services/PostulacionService";

const service = new PostulacionService();

export const menuPostulacion = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Postulaciones ---");
        console.log("1. Listar por Estudiante");
        console.log("2. Buscar por ID");
        console.log("3. Crear nueva");
        console.log("4. Actualizar estado");
        console.log("5. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const idEst = parseInt(await ask("ID del Estudiante: "));
                    const postulaciones = await service.obtenerPorEstudiante(idEst);
                    console.log("Postulaciones encontradas: " + postulaciones.length);
                    console.log(JSON.stringify(postulaciones, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID de la postulación: "));
                    const post = await service.obtenerPorId(id);
                    console.log(post ? JSON.stringify(post, null, 2) : "No encontrada");
                    break;
                case "3":
                    const fk_id_estudiante = parseInt(await ask("ID del Estudiante (fk_id_estudiante): "));
                    const fk_id_oportunidad = parseInt(await ask("ID de la Oportunidad (fk_id_oportunidad): "));
                    const carta_motivacion = await ask("Carta de motivación: ");
                    const curriculum_url = await ask("URL del currículum: ");
                    const porcentaje_compatibilidad = parseFloat(await ask("Porcentaje de compatibilidad: "));
                    
                    const newId = await service.crearPostulacion({
                        fk_id_estudiante, fk_id_oportunidad, carta_motivacion,
                        curriculum_url, porcentaje_compatibilidad
                    });
                    console.log("Postulación creada con ID: " + newId);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const estadoUpd = await ask("Estado (PENDIENTE/EN_REVISION/PRESELECCIONADO/ENTREVISTA/ACEPTADO/RECHAZADO/RETIRADO): ") as any;
                    const comentarios_revisor = await ask("Comentarios del revisor: ");
                    
                    await service.actualizarEstadoPostulacion(idUpd, {
                        estado: estadoUpd,
                        comentarios_revisor: comentarios_revisor
                    });
                    console.log("Postulación actualizada");
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