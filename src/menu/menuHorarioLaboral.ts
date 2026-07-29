import { ask } from "../utils/readline";
import { HorarioLaboralService } from "../services/HorarioLaboralService";

const service = new HorarioLaboralService();

// Menú CRUD para Horarios Laborales
export const menuHorarioLaboral = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Horarios Laborales ---");
        console.log("1. Listar por Estudiante");
        console.log("2. Buscar por ID");
        console.log("3. Crear nuevo");
        console.log("4. Actualizar");
        console.log("5. Eliminar");
        console.log("6. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const idEst = parseInt(await ask("ID del Estudiante: "));
                    const horarios = await service.obtenerPorEstudiante(idEst);
                    console.log("Horarios encontrados: " + horarios.length);
                    console.log(JSON.stringify(horarios, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID del horario: "));
                    const hor = await service.obtenerPorId(id);
                    console.log(hor ? JSON.stringify(hor, null, 2) : "No encontrado");
                    break;
                case "3":
                    const fk_id_estudiante = parseInt(await ask("ID del Estudiante (fk_id_estudiante): "));
                    const fk_id_empleador = parseInt(await ask("ID del Empleador (fk_id_empleador): "));
                    const puesto = await ask("Puesto: ");
                    const departamento = await ask("Departamento: ");
                    const supervisor = await ask("Supervisor: ");
                    const dia_semana = await ask("Día (LUNES/MARTES/MIERCOLES/JUEVES/VIERNES/SABADO/DOMINGO): ") as any;
                    const hora_inicio = await ask("Hora inicio (HH:MM:SS): ");
                    const hora_fin = await ask("Hora fin (HH:MM:SS): ");
                    const salario = parseFloat(await ask("Salario: "));
                    
                    const newId = await service.crearHorarioLaboral({
                        fk_id_estudiante, fk_id_empleador, puesto, departamento, supervisor,
                        dia_semana, hora_inicio, hora_fin, salario
                    });
                    console.log("Horario laboral creado con ID: " + newId);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const diaUpd = await ask("Día (LUNES/MARTES/MIERCOLES/JUEVES/VIERNES/SABADO/DOMINGO): ") as any;
                    const horaIniUpd = await ask("Hora inicio (HH:MM:SS): ");
                    const horaFinUpd = await ask("Hora fin (HH:MM:SS): ");
                    const estadoUpd = await ask("Estado (ACTIVO/INACTIVO/SUSPENDIDO): ") as any;
                    
                    await service.actualizarHorarioLaboral(idUpd, {
                        dia_semana: diaUpd,
                        hora_inicio: horaIniUpd,
                        hora_fin: horaFinUpd,
                        estado: estadoUpd
                    });
                    console.log("Horario laboral actualizado");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarHorarioLaboral(idDel);
                    console.log("Horario laboral eliminado");
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