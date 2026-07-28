import { ask } from '../utils/readline';
import { UsuarioService } from '../services/usuarioService';

const service = new UsuarioService();

// Menú CRUD para Usuarios
export const menuUsuario = async () => {
    let back = false;
    while (!back) {
        console.log("--- Gestión de Usuarios ---");
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
                    const usuarios = await service.obtenerTodos();
                    console.log(`Usuarios encontrados: ${usuarios.length}`);
                    console.log(JSON.stringify(usuarios, null, 2));
                    break;
                case "2":
                    const id = parseInt(await ask("ID del usuario: "));
                    const user = await service.obtenerPorId(id);
                    console.log(user ? JSON.stringify(user, null, 2) : "No encontrado");
                    break;
                case "3":
                    const nombre = await ask("Nombre: ");
                    const email = await ask("Email: ");
                    const contrasena = await ask("Contraseña: ");
                    const tipo = await ask("Tipo (ESTUDIANTE/PROFESOR/EMPLEADOR/ADMIN): ");
                    const newId = await service.crearUsuario({ 
                        nombre, email, contrasena, tipo_usuario: tipo as any 
                    });
                    console.log(`Usuario creado con ID: ${newId}`);
                    break;
                case "4":
                    const idUpd = parseInt(await ask("ID a actualizar: "));
                    const nombreUpd = await ask("Nombre: ");
                    const emailUpd = await ask("Email: ");
                    const tipoUpd = await ask("Tipo (ESTUDIANTE/PROFESOR/EMPLEADOR/ADMIN): ");
                    const activo = await ask("Activo (1/0): ");
                    await service.actualizarUsuario(idUpd, {
                        nombre: nombreUpd,
                        email: emailUpd,
                        tipo_usuario: tipoUpd as any,
                        activo: parseInt(activo)
                    });
                    console.log("Usuario actualizado");
                    break;
                case "5":
                    const idDel = parseInt(await ask("ID a eliminar: "));
                    await service.eliminarUsuario(idDel);
                    console.log("Usuario eliminado");
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