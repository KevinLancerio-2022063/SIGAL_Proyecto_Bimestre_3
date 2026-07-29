import { ask } from "../utils/readline";
import { CursoService } from "../services/CursoService";

const service = new CursoService();

// Menú CRUD para Cursos
export const menuCurso = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Cursos ---");
        console.log("1. Listar todos");
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
                    const cursos = await service.obtenerTodos();
                    console.log("Cursos encontrados: " + cursos.length);
                    console.log(JSON.stringify(cursos, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID del curso: "));
                    const curso = await service.obtenerPorId(id);
                    console.log(curso ? JSON.stringify(curso, null, 2) : "No encontrado");
                    break;
                case "3":
                    const codigo = await ask("Código del curso: ");
                    const nombre = await ask("Nombre: ");
                    const descripcion = await ask("Descripción: ");
                    const creditos = parseInt(await ask("Créditos: "));
                    const horas = parseInt(await ask("Horas: "));
                    const fk_id_profesor = parseInt(await ask("ID del Profesor (fk_id_profesor): "));
                    const fk_id_universidad = parseInt(await ask("ID de la Universidad (fk_id_universidad): "));
                    const modalidadInput = await ask("Modalidad (PRESENCIAL/VIRTUAL/HIBRIDO): ");
                    const modalidad = modalidadInput as "PRESENCIAL" | "VIRTUAL" | "HIBRIDO";                   
                    const semestre = await ask("Semestre (ej. 2025-1): ");
                    
                    const newId = await service.crearCurso({
                        codigo_curso: codigo, nombre, descripcion, creditos, horas,
                        fk_id_profesor, fk_id_universidad, modalidad, semestre
                    });
                    console.log("Curso creado con ID: " + newId);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const nombreUpd = await ask("Nombre: ");
                    const creditosUpd = parseInt(await ask("Créditos: "));
                    const modalidadUpd = await ask("Modalidad (PRESENCIAL/VIRTUAL/HIBRIDO): ");
                    
                    await service.actualizarCurso(idUpd, {
                        nombre: nombreUpd,
                        creditos: creditosUpd,
                        modalidad: modalidadUpd as any
                    });
                    console.log("Curso actualizado");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarCurso(idDel);
                    console.log("Curso eliminado");
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