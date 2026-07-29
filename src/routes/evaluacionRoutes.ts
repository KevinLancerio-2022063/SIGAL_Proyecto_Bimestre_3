import { IncomingMessage, ServerResponse } from "http";
import { EvaluacionService } from "../services/EvaluacionService";

const evaluacionService = new EvaluacionService();

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

export const evaluacionRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar evaluaciones por curso (?id_curso=X)
  if (url === "/api/evaluaciones" && req.method === "GET") {
    try {
      const urlParams = new URL(req.url || "", "http://localhost").searchParams;
      const idCurso = parseInt(urlParams.get("id_curso") || "0");
      
      if (!idCurso) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Se requiere el parámetro id_curso" }));
        return true;
      }

      const evaluaciones = await evaluacionService.obtenerPorCurso(idCurso);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: evaluaciones, total: evaluaciones.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener evaluaciones" }));
      return true;
    }
  }

  // GET: Obtener evaluación por ID
  if (url.startsWith("/api/evaluaciones/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const evaluacion = await evaluacionService.obtenerPorId(id);
      
      if (!evaluacion) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Evaluación no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: evaluacion }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener la evaluación" }));
      return true;
    }
  }

  // POST: Crear una nueva evaluación
  if (url === "/api/evaluaciones" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await evaluacionService.crearEvaluacion(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Evaluación creada", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al crear evaluación";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar una evaluación
  if (url.startsWith("/api/evaluaciones/") && req.method === "DELETE") {
    try {
      const id = parseInt(url.split("/")[3]);
      const eliminada = await evaluacionService.eliminarEvaluacion(id);
      
      if (!eliminada) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Evaluación no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Evaluación eliminada" }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al eliminar";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  return false;
};