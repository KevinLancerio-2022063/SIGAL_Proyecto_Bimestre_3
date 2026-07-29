import { ask } from "../utils/readline";
import { SolicitudAjusteService } from "../services/SolicitudAjusteService";

const service = new SolicitudAjusteService();

// Menú CRUD para Solicitudes de Ajuste
export const menuSolicitudAjuste = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Solicitudes de Ajuste ---");
        console.log("1. Listar por Estudiante");
        console.log("2. Buscar por ID");
        console.log("3. Crear nueva");
        console.log("4. Resolver solicitud");
        console.log("5. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const idEst = parseInt(await ask("ID del Estudiante: "));
                    const solicitudes = await service.obtenerPorEstudiante(idEst);
                    console.log("Solicitudes encontradas: " + solicitudes.length);
                    console.log(JSON.stringify(solicitudes, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID de la solicitud: "));
                    const sol = await service.obtenerPorId(id);
                    console.log(sol ? JSON.stringify(sol, null, 2) : "No encontrada");
                    break;
                case "3":
                    const fk_id_estudiante = parseInt(await ask("ID del Estudiante (fk_id_estudiante): "));
                    const tipo = await ask("Tipo (CAMBIO_HORARIO/PERMISO_LABORAL/EXTENSION_ENTREGA/OTRO): ") as any;
                    const descripcion = await ask("Descripción: ");
                    const justificacion = await ask("Justificación: ");
                    const fk_id_profesor_str = await ask("ID del Profesor (dejar vacío si no aplica): ");
                    const fk_id_empleador_str = await ask("ID del Empleador (dejar vacío si no aplica): ");
                    
                    const newId = await service.agregarSolicitud({
                        fk_id_estudiante,
                        tipo,
                        descripcion,
                        justificacion,
                        fk_id_profesor: fk_id_profesor_str ? parseInt(fk_id_profesor_str) : null,
                        fk_id_empleador: fk_id_empleador_str ? parseInt(fk_id_empleador_str) : null
                    });
                    console.log("Solicitud creada con ID: " + newId);
                    break;
                case "4":
                    const idRes = parseInt(await ask("ID de la solicitud a resolver: "));
                    const estadoRes = await ask("Estado (PENDIENTE/APROBADA/RECHAZADA/EN_REVISION): ") as any;
                    const justificacionRes = await ask("Justificación de la resolución: ");
                    
                    await service.resolverSolicitud(idRes, {
                        estado: estadoRes,
                        justificacion: justificacionRes
                    });
                    console.log("Solicitud resuelta");
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