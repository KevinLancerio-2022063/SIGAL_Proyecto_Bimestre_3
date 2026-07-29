import { ask } from "../utils/readline";
import { AuditoriaService } from "../services/AuditoriaService";

const service = new AuditoriaService();

// Menú para Auditoría
export const menuAuditoria = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Auditoría ---");
        console.log("1. Listar todos los registros");
        console.log("2. Registrar nuevo evento");
        console.log("3. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const registros = await service.obtenerTodos();
                    console.log("Registros encontrados: " + registros.length);
                    console.log(JSON.stringify(registros, null, 2));
                    break;
                case "2":
                    const tabla = await ask("Tabla afectada (ej. Usuario, Oportunidad): ");
                    const accion = await ask("Acción (INSERT/UPDATE/DELETE/LOGIN/LOGOUT): ") as any;
                    const fk_id_usuario = parseInt(await ask("ID del Usuario que realizó la acción: "));
                    const descripcion = await ask("Descripción de la acción: ");
                    const ip_origen = await ask("IP de origen (ej. 192.168.1.1): ");
                    
                    const newId = await service.registrarAuditoria({
                        tabla_afectada: tabla,
                        accion,
                        fk_id_usuario,
                        descripcion,
                        ip_origen
                    });
                    console.log("Evento de auditoría registrado con ID: " + newId);
                    break;
                case "3":
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