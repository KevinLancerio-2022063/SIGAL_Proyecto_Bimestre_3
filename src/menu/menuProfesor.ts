import { ask } from '../utils/readline';
import { ProfesorService } from '../services/ProfesorService';

const service = new ProfesorService();

// Menú CRUD para Profesores
export const menuProfesor = async () => {
    let back = false;
    while (!back) {
        console.log("--- Gestión de Profesores ---");
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
                    const profesores = await service.obtenerTodos();
                    console.log(`Profesores encontrados: ${profesores.length}`);
                    console.log(JSON.stringify(profesores, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID del profesor: "));
                    const prof = await service.obtenerPorId(id);
                    console.log(prof ? JSON.stringify(prof, null, 2) : "No encontrado");
                    break;
                case "3":
                    const fk_id_usuario = parseInt(await ask("ID del Usuario (fk_id_usuario): "));
                    const fk_id_universidad = parseInt(await ask("ID de la Universidad (fk_id_universidad): "));
                    const numero_empleado = await ask("Número de empleado: ");
                    const departamento = await ask("Departamento: ");
                    const especialidad = await ask("Especialidad: ");
                    const oficina = await ask("Oficina: ");
                    const telefono_oficina = await ask("Teléfono de oficina: ");
                    const horas_tutoria = await ask("Horas de tutoría: ");

                    const newId = await service.crearProfesor({
                        fk_id_usuario, fk_id_universidad, numero_empleado,
                        departamento, especialidad, oficina, telefono_oficina, horas_tutoria
                    });
                    console.log(`Profesor creado con ID: ${newId}`);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const departamentoUpd = await ask("Departamento: ");
                    const especialidadUpd = await ask("Especialidad: ");
                    const activoUpd = await ask("Activo (1/0): ");
                    
                    await service.actualizarProfesor(idUpd, {
                        departamento: departamentoUpd,
                        especialidad: especialidadUpd,
                        activo: parseInt(activoUpd)
                    });
                    console.log("Profesor actualizado");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarProfesor(idDel);
                    console.log("Profesor eliminado");
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