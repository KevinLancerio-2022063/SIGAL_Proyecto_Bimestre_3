import { IncomingMessage, ServerResponse } from "http";
import { PostulacionService } from "../services/PostulacionService";

const postulacionService = new PostulacionService();

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

export const postulacionRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar postulaciones por estudiante (?id_estudiante=X)
  if (url === "/api/postulaciones" && req.method === "GET") {
    try {
      const urlParams = new URL(req.url || "", "http://localhost").searchParams;
      const idEstudiante = parseInt(urlParams.get("id_estudiante") || "0");
      
      if (!idEstudiante) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Se requiere el parámetro id_estudiante" }));
        return true;
      }

      const postulaciones = await postulacionService.obtenerPorEstudiante(idEstudiante);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: postulaciones, total: postulaciones.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener postulaciones" }));
      return true;
    }
  }

  // GET: Obtener postulación por ID
  if (url.startsWith("/api/postulaciones/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const postulacion = await postulacionService.obtenerPorId(id);
      
      if (!postulacion) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Postulación no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: postulacion }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener la postulación" }));
      return true;
    }
  }

  // POST: Crear una nueva postulación
  if (url === "/api/postulaciones" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await postulacionService.crearPostulacion(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Postulación creada", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al crear postulación";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar estado de postulación
  if (url.startsWith("/api/postulaciones/") && req.method === "PUT") {
    try {
      const id = parseInt(url.split("/")[3]);
      const body = await parseBody(req);
      const actualizada = await postulacionService.actualizarEstadoPostulacion(id, body);
      
      if (!actualizada) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Postulación no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Postulación actualizada" }));
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