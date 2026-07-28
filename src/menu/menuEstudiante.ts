import { ask } from '../utils/readline';
import { EstudianteService } from '../services/EstudianteService';

const service = new EstudianteService();

// Menú CRUD para Estudiantes
export const menuEstudiante = async () => {
    let back = false;
    while (!back) {
        console.log("--- Gestión de Estudiantes ---");
        console.log("1. Listar todos");
        console.log("2. Buscar por ID");
        console.log("3. Crear nuevo");
        console.log("4. Actualizar");
        console.log("5. Eliminar");
        console.log("6. Volver al menú principal");

        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const estudiantes = await service.obtenerTodos();
                    console.log(`Estudiantes encontrados: ${estudiantes.length}`);
                    console.log(JSON.stringify(estudiantes, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID del estudiante: "));
                    const est = await service.obtenerPorId(id);
                    console.log(est ? JSON.stringify(est, null, 2) : "No encontrado");
                    break;
                case "3":
                    const fk_id_usuario = parseInt(await ask("ID del Usuario (fk_id_usuario): "));
                    const fk_id_universidad = parseInt(await ask("ID de la Universidad (fk_id_universidad): "));
                    const matricula = await ask("Matrícula: ");
                    const carrera = await ask("Carrera: ");
                    const semestre = parseInt(await ask("Semestre: "));
                    const codigo_interno = await ask("Código interno: ");
                    
                    const newId = await service.crearEstudiante({
                        fk_id_usuario, fk_id_universidad, matricula, carrera, semestre, codigo_interno
                    });
                    console.log(`Estudiante creado con ID: ${newId}`);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const carreraUpd = await ask("Carrera: ");
                    const semestreUpd = parseInt(await ask("Semestre: "));
                    const estadoUpd = await ask("Estado (ACTIVO/INACTIVO/GRADUADO/SUSPENDIDO): ");
                    
                    await service.actualizarEstudiante(idUpd, {
                        carrera: carreraUpd,
                        semestre: semestreUpd,
                        estado: estadoUpd as any
                    });
                    console.log("Estudiante actualizado");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarEstudiante(idDel);
                    console.log("Estudiante eliminado");
                    break;
                case "6":
                    back = true;
                    break;
                default:
                    console.log("Opción inválida");
            }
        } catch (error: any) {
            console.error("Error: ", error.message);
        }
    }
};