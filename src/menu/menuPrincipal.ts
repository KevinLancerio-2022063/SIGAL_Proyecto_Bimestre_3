import { ask, closeRl } from "../utils/readline";
import { menuUsuario } from "./menuUsuario";
import { menuUniversidad } from "./menuUniversidad";
import { menuEstudiante } from "./menuEstudiante";
import { menuProfesor } from "./menuProfesor";
import { menuEmpleador } from "./menuEmpleador";
import { menuCurso } from "./menuCurso";
import { menuHorarioAcademico } from "./menuHorarioAcademico";
import { menuHorarioLaboral } from "./menuHorarioLaboral";
import { menuConflictoHorario } from "./menuConflictoHorario";
import { menuSolicitudAjuste } from "./menuSolicitudAjuste";
import { menuOportunidad } from "./menuOportunidad";
import { menuEvaluacion } from "./menuEvaluacion";
import { menuCalificacion } from "./menuCalificacion";
import { menuPostulacion } from "./menuPostulacion";
import { menuAuditoria } from "./menuAuditoria";

// Muestra el menú principal y maneja la navegación
export const showMainMenu = async (): Promise<string> => {
    let running = true;
    while (running) {
        console.log("");
        console.log("--- SIGAL - Menú Principal ---");
        console.log("1. Iniciar servidor HTTP (API REST)");
        console.log("2. Abrir menú de consola");
        console.log("3. Salir");

        console.log("");
        const option = await ask("Selecciona una opción: ");

        if (option === "1") {
            closeRl();
            return "SERVER";
        } else if (option === "2") {
            await showEntityMenu();
        } else if (option === "3") {
            console.log("Saliendo del sistema...");
            closeRl();
            process.exit(0);
        } else {
            console.log("Opción inválida, intenta de nuevo.");
        }
    }
    return "EXIT";
};

// Menú para seleccionar entidad
const showEntityMenu = async () => {
    let back = false;
    while (!back) {
        console.log("");
        console.log("--- Gestión de Entidades ---");
        console.log("1. Usuarios");
        console.log("2. Universidades");
        console.log("3. Estudiantes");
        console.log("4. Profesores");
        console.log("5. Empleadores");
        console.log("6. Cursos");
        console.log("7. Horarios Académicos");
        console.log("8. Horarios Laborales");
        console.log("9. Conflictos Horario");
        console.log("10. Solicitudes de Ajuste");
        console.log("11. Oportunidades");
        console.log("12. Evaluaciones");
        console.log("13. Calificaciones");
        console.log("14. Postulaciones");
        console.log("15. Auditoría");
        console.log("16. Volver al menú principal");

        console.log("");
        const option = await ask("Selecciona una entidad: ");

        switch (option) {
            case "1": await menuUsuario(); break;
            case "2": await menuUniversidad(); break;
            case "3": await menuEstudiante(); break;
            case "4": await menuProfesor(); break;
            case "5": await menuEmpleador(); break;
            case "6": await menuCurso(); break;
            case "7": await menuHorarioAcademico(); break;
            case "8": await menuHorarioLaboral(); break;
            case "9": await menuConflictoHorario(); break;
            case "10": await menuSolicitudAjuste(); break;
            case "11": await menuOportunidad(); break;
            case "12": await menuEvaluacion(); break;
            case "13": await menuCalificacion(); break;
            case "14": await menuPostulacion(); break;
            case "15": await menuAuditoria(); break;
            case "16": back = true; break;
            default: console.log("Opción inválida.");
        }
    }
};