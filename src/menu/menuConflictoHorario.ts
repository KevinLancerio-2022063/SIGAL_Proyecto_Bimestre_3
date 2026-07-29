import { ask } from "../utils/readline";
import { ConflictoHorarioService } from "../services/ConflictoHorarioService";

const service = new ConflictoHorarioService();

// Menú CRUD para Conflictos Horarios
export const menuConflictoHorario = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Conflictos Horarios ---");
        console.log("1. Listar por Estudiante");
        console.log("2. Buscar por ID");
        console.log("3. Registrar nuevo");
        console.log("4. Resolver conflicto");
        console.log("5. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const idEst = parseInt(await ask("ID del Estudiante: "));
                    const conflictos = await service.obtenerPorEstudiante(idEst);
                    console.log("Conflictos encontrados: " + conflictos.length);
                    console.log(JSON.stringify(conflictos, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID del conflicto: "));
                    const conf = await service.obtenerPorId(id);
                    console.log(conf ? JSON.stringify(conf, null, 2) : "No encontrado");
                    break;
                case "3":
                    const fk_id_estudiante = parseInt(await ask("ID del Estudiante (fk_id_estudiante): "));
                    const fk_id_horario_academico_str = await ask("ID del Horario Académico (dejar vacío si no aplica): ");
                    const fk_id_horario_laboral_str = await ask("ID del Horario Laboral (dejar vacío si no aplica): ");
                    const tipo_conflicto = await ask("Tipo (SUPERPOSICION/CARGA_EXCESIVA/VIAJE_LARGO): ") as any;
                    const solucion_propuesta = await ask("Solución propuesta: ");
                    
                    const newId = await service.registrarConflicto({
                        fk_id_estudiante,
                        fk_id_horario_academico: fk_id_horario_academico_str ? parseInt(fk_id_horario_academico_str) : null,
                        fk_id_horario_laboral: fk_id_horario_laboral_str ? parseInt(fk_id_horario_laboral_str) : null,
                        tipo_conflicto,
                        solucion_propuesta
                    });
                    console.log("Conflicto registrado con ID: " + newId);
                    break;
                case "4":
                    const idRes = parseInt(await ask("ID del conflicto a resolver: "));
                    const estadoRes = await ask("Estado (PENDIENTE/EN_PROCESO/RESUELTO/IGNORADO): ") as any;
                    const solucionRes = await ask("Solución propuesta actualizada: ");
                    
                    await service.resolverConflicto(idRes, {
                        estado: estadoRes,
                        solucion_propuesta: solucionRes
                    });
                    console.log("Conflicto resuelto");
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