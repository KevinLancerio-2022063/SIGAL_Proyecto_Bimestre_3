import { IncomingMessage, ServerResponse } from "http";
import { usuarioRoutes } from "../routes/usuarioRoutes";
import { universidadRoutes } from "../routes/universidadRoutes";
import { estudianteRoutes } from "../routes/estudianteRoutes";
import { profesorRoutes } from "../routes/profesorRoutes";
import { empleadorRoutes } from "../routes/empleadorRoutes";
import { cursoRoutes } from "../routes/cursoRoutes";
import { horarioAcademicoRoutes } from "../routes/horarioAcademicoRoutes";
import { horarioLaboralRoutes } from "../routes/horarioLaboralRoutes";
import { conflictoHorarioRoutes } from "../routes/conflictoHorarioRoutes";
import { solicitudAjusteRoutes } from "../routes/solicitudAjusteRoutes";
import { oportunidadRoutes } from "../routes/oportunidadRoutes";
import { evaluacionRoutes } from "../routes/evaluacionRoutes";
import { calificacionRoutes } from "../routes/calificacionRoutes";
import { postulacionRoutes } from "../routes/postulacionRoutes";
import { auditoriaRoutes } from "../routes/auditoriaRoutes";

// Función principal que enruta las peticiones
export const router = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<void> => {
  
  // Ruta raíz: muestra un menú de rutas disponibles
  if (url === "/" || url === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "SIGAL API - Servidor Nativo Node.js",
      routes: {
        usuarios: ["/api/usuarios", "/api/usuarios/:id"],
        universidades: ["/api/universidades", "/api/universidades/:id"],
        estudiantes: ["/api/estudiantes", "/api/estudiantes/:id"],
        profesores: ["/api/profesores", "/api/profesores/:id"],
        empleadores: ["/api/empleadores", "/api/empleadores/:id"],
        cursos: ["/api/cursos", "/api/cursos/:id"],
        horarios_academicos: ["/api/horarios-academicos", "/api/horarios-academicos/:id"],
        horarios_laborales: ["/api/horarios-laborales", "/api/horarios-laborales/:id"],
        conflictos_horario: ["/api/conflictos-horario", "/api/conflictos-horario/:id"],
        solicitudes_ajuste: ["/api/solicitudes-ajuste", "/api/solicitudes-ajuste/:id"],
        oportunidades: ["/api/oportunidades", "/api/oportunidades/:id"],
        evaluaciones: ["/api/evaluaciones", "/api/evaluaciones/:id"],
        calificaciones: ["/api/calificaciones", "/api/calificaciones/:id"],
        postulaciones: ["/api/postulaciones", "/api/postulaciones/:id"],
        auditoria: ["/api/auditoria"]
      }
    }, null, 2));
    return;
  }

  // Intentamos con cada ruta en orden
  if (await usuarioRoutes(req, res, url)) return;
  if (await universidadRoutes(req, res, url)) return;
  if (await estudianteRoutes(req, res, url)) return;
  if (await profesorRoutes(req, res, url)) return;
  if (await empleadorRoutes(req, res, url)) return;
  if (await cursoRoutes(req, res, url)) return;
  if (await horarioAcademicoRoutes(req, res, url)) return;
  if (await horarioLaboralRoutes(req, res, url)) return;
  if (await conflictoHorarioRoutes(req, res, url)) return;
  if (await solicitudAjusteRoutes(req, res, url)) return;
  if (await oportunidadRoutes(req, res, url)) return;
  if (await evaluacionRoutes(req, res, url)) return;
  if (await calificacionRoutes(req, res, url)) return;
  if (await postulacionRoutes(req, res, url)) return;
  if (await auditoriaRoutes(req, res, url)) return;

  // Si ninguna ruta coincidió: Error 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ 
    success: false, 
    message: "Ruta no encontrada",
    method: req.method,
    url: url
  }));
};