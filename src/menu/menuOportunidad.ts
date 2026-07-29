import { ask } from "../utils/readline";
import { OportunidadService } from "../services/OportunidadService";

const service = new OportunidadService();

export const menuOportunidad = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Oportunidades ---");
        console.log("1. Listar todas");
        console.log("2. Buscar por ID");
        console.log("3. Crear nueva");
        console.log("4. Actualizar");
        console.log("5. Eliminar");
        console.log("6. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const oportunidades = await service.obtenerTodas();
                    console.log("Oportunidades encontradas: " + oportunidades.length);
                    console.log(JSON.stringify(oportunidades, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID de la oportunidad: "));
                    const op = await service.obtenerPorId(id);
                    console.log(op ? JSON.stringify(op, null, 2) : "No encontrada");
                    break;
                case "3":
                    const titulo = await ask("Título: ");
                    const descripcion = await ask("Descripción: ");
                    const tipo = await ask("Tipo (BECA/PASANTIA/EMPLEO/PROGRAMA_INTERCAMBIO): ") as any;
                    const fk_id_empleador = parseInt(await ask("ID del Empleador (fk_id_empleador): "));
                    const fk_id_universidad = parseInt(await ask("ID de la Universidad (fk_id_universidad): "));
                    const publicado_por = await ask("Publicado por (EMPLEADOR/UNIVERSIDAD/ADMIN): ") as any;
                    const requisitos_principales = await ask("Requisitos principales: ");
                    const salario = parseFloat(await ask("Salario: "));
                    const duracion = await ask("Duración: ");
                    const fecha_vencimiento = await ask("Fecha vencimiento (YYYY-MM-DD HH:MM:SS): ");
                    
                    const newId = await service.crearOportunidad({
                        titulo, descripcion, tipo, fk_id_empleador, fk_id_universidad,
                        publicado_por, requisitos_principales, salario, duracion, fecha_vencimiento
                    });
                    console.log("Oportunidad creada con ID: " + newId);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const tituloUpd = await ask("Título: ");
                    const estadoUpd = await ask("Estado (ACTIVA/CERRADA/PAUSADA/VENCIDA): ") as any;
                    
                    await service.actualizarOportunidad(idUpd, {
                        titulo: tituloUpd,
                        estado: estadoUpd
                    });
                    console.log("Oportunidad actualizada");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarOportunidad(idDel);
                    console.log("Oportunidad eliminada");
                    break;
                case "6":
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