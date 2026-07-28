import { ask } from '../utils/readline';
import { UniversidadService } from '../services/UniversidadService';

const service = new UniversidadService();

// Menú CRUD para Universidades
export const menuUniversidad = async () => {
    let back = false;
    while (!back) {
        console.log("--- Gestión de Universidades ---");
        console.log("1. Listar todas");
        console.log("2. Buscar por ID");
        console.log("3. Crear nueva");
        console.log("4. Actualizar");
        console.log("5. Eliminar");
        console.log("6. Volver al menú principal");

        const option = await ask("Selecciona una opción: ");

        try {
            switch (option) {
                case "1":
                    const universidades = await service.obtenerTodas();
                    console.log(`Universidades encontradas: ${universidades.length}`);
                    console.log(JSON.stringify(universidades, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID de la universidad: "));
                    const universidad = await service.obtenerPorId(id);
                    console.log(universidad ? JSON.stringify(universidad, null, 2) : "No encontrada");
                    break;
                case "3":
                    const nombre = await ask("Nombre: ");
                    const sigla = await ask("Sigla: ");
                    const ubicacion = await ask("Ubicación: ");
                    const ciudad = await ask("Ciudad: ");
                    const pais = await ask("País: ");
                    const telefono = await ask("Teléfono: ");
                    const email = await ask("Email: ");
                    const sitio_web = await ask("Sitio web: ");
                    const rectora = await ask("Rectora: ");
                    const codigo_institucional = await ask("Código institucional: ");
                    const imagen_logo = await ask("Imagen logo: ");
                    const acreditacion = await ask("Acreditación: ");
                    const tipos_programa = await ask("Tipos de programa: ");
                    const newId = await service.crearUniversidad({
                        nombre, sigla, ubicacion, ciudad, pais, telefono, email,
                        sitio_web, rectora, codigo_institucional, imagen_logo,
                        acreditacion, tipos_programa
                    });
                    console.log(`Universidad creada con ID: ${newId}`);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const nombreUpd = await ask("Nombre: ");
                    const siglaUpd = await ask("Sigla: ");
                    const ciudadUpd = await ask("Ciudad: ");
                    const estadoUpd = await ask("Estado (ACTIVA/INACTIVA): ");
                    await service.actualizarUniversidad(idUpd, {
                        nombre: nombreUpd,
                        sigla: siglaUpd,
                        ciudad: ciudadUpd,
                        estado: estadoUpd as any
                    });
                    console.log("Universidad actualizada");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarUniversidad(idDel);
                    console.log("Universidad eliminada");
                    break;
                case "6":
                    back = true;
                    break;
                default:
                    console.log("Opción inválida");
            }
        } catch (error: any) {
            console.error("Error:", error.message);
        }
    }
};