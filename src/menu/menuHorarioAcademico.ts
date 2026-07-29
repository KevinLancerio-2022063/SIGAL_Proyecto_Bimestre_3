import { ask } from "../utils/readline";
import { HorarioAcademicoService } from "../services/HorarioAcademicoService";

const service = new HorarioAcademicoService();

// Menú CRUD para Horarios Académicos
export const menuHorarioAcademico = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Horarios Académicos ---");
        console.log("1. Listar por Estudiante");
        console.log("2. Buscar por ID");
        console.log("3. Crear nuevo");
        console.log("4. Eliminar");
        console.log("5. Volver al menú principal");

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
                    const fk_id_curso = parseInt(await ask("ID del Curso (fk_id_curso): "));
                    const dia_semana = await ask("Día (LUNES/MARTES/MIERCOLES/JUEVES/VIERNES/SABADO/DOMINGO): ") as any;
                    const hora_inicio = await ask("Hora inicio (HH:MM:SS): ");
                    const hora_fin = await ask("Hora fin (HH:MM:SS): ");
                    const aula = await ask("Aula: ");
                    const semestre = await ask("Semestre (ej. 2025-1): ");
                    const anio = parseInt(await ask("Año (ej. 2025): "));
                    
                    const newId = await service.crearHorarioAcademico({
                        fk_id_estudiante, fk_id_curso, dia_semana,
                        hora_inicio, hora_fin, aula, semestre, anio
                    });
                    console.log("Horario académico creado con ID: " + newId);
                    break;
                case "4":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarHorarioAcademico(idDel);
                    console.log("Horario académico eliminado");
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