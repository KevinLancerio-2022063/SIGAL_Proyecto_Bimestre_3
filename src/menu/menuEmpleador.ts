import { ask } from '../utils/readline';
import { EmpleadorService } from '../services/EmpleadorService';

const service = new EmpleadorService();

// Menú CRUD para Empleadores
export const menuEmpleador = async () => {
    let back = false;
    while (!back) {
        console.log("--- Gestión de Empleadores ---");
        console.log("1. Listar todos");
        console.log("2. Buscar por ID");
        console.log("3. Crear nuevo");
        console.log("4. Actualizar");
        console.log("5. Eliminar");
        console.log("6. Volver al menú principal");

        const option = await ask('\nSelecciona una opción: ');

        try {
            switch (option) {
                case "1":
                    const empleadores = await service.obtenerTodos();
                    console.log(`Empleadores encontrados: ${empleadores.length}`);
                    console.log(JSON.stringify(empleadores, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID del empleador: "));
                    const emp = await service.obtenerPorId(id);
                    console.log(emp ? JSON.stringify(emp, null, 2) : "No encontrado");
                    break;
                case "3":
                    const fk_id_usuario = parseInt(await ask("ID del Usuario (fk_id_usuario): "));
                    const nombre_empresa = await ask("Nombre de la empresa: ");
                    const nit = await ask("NIT: ");
                    const sector = await ask("Sector: ");
                    const ubicacion = await ask("Ubicación: ");
                    const telefono_empresa = await ask("Teléfono de la empresa: ");
                    const sitio_web = await ask("Sitio web: ");
                    const numero_empleados = parseInt(await ask("Número de empleados: "));
                    const representante_legal = await ask("Representante legal: ");
                    
                    const newId = await service.crearEmpleador({
                        fk_id_usuario, nombre_empresa, nit, sector, ubicacion,
                        telefono_empresa, sitio_web, numero_empleados, representante_legal
                    });
                    console.log(`Empleador creado con ID: ${newId}`);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const nombreUpd = await ask("Nombre de la empresa: ");
                    const sectorUpd = await ask("Sector: ");
                    const ubicacionUpd = await ask("Ubicación: ");
                    
                    await service.actualizarEmpleador(idUpd, {
                        nombre_empresa: nombreUpd,
                        sector: sectorUpd,
                        ubicacion: ubicacionUpd
                    });
                    console.log("Empleador actualizado");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarEmpleador(idDel);
                    console.log("Empleador eliminado");
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