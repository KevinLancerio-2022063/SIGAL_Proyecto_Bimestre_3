import { IncomingMessage, ServerResponse } from "http";
import { CalificacionService } from "../services/CalificacionService";

const calificacionService = new CalificacionService();

// Función auxiliar para leer el cuerpo de la petición en Node nativo
const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
  });
};

// Función que maneja las rutas de calificación
export const calificacionRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar calificaciones por estudiante (?id_estudiante=X)
  if (url === "/api/calificaciones" && req.method === "GET") {
    try {
      const urlParams = new URL(req.url || "", "http://localhost").searchParams;
      const idEstudiante = parseInt(urlParams.get("id_estudiante") || "0");
      
      if (!idEstudiante) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Se requiere el parámetro id_estudiante" }));
        return true;
      }

      const calificaciones = await calificacionService.obtenerPorEstudiante(idEstudiante);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: calificaciones, total: calificaciones.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener calificaciones" }));
      return true;
    }
  }

  // GET: Obtener calificación por ID
  if (url.startsWith("/api/calificaciones/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const calificacion = await calificacionService.obtenerPorId(id);
      
      if (!calificacion) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Calificación no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: calificacion }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener la calificación" }));
      return true;
    }
  }

  // POST: Crear una nueva calificación
  if (url === "/api/calificaciones" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await calificacionService.crearCalificacion(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Calificación creada", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al crear calificación";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar una calificación
  if (url.startsWith("/api/calificaciones/") && req.method === "PUT") {
    try {
      const id = parseInt(url.split("/")[3]);
      const body = await parseBody(req);
      const actualizada = await calificacionService.actualizarCalificacion(id, body);
      
      if (!actualizada) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Calificación no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Calificación actualizada" }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al actualizar";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  return false;
};