import { IncomingMessage, ServerResponse } from "http";
import { CursoService } from "../services/CursoService";

const cursoService = new CursoService();

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

// Función que maneja las rutas de curso
export const cursoRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todos los cursos
  if (url === "/api/cursos" && req.method === "GET") {
    try {
      const cursos = await cursoService.obtenerTodos();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: cursos, total: cursos.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener cursos" }));
      return true;
    }
  }

  // GET: Obtener curso por ID
  if (url.startsWith("/api/cursos/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const curso = await cursoService.obtenerPorId(id);
      
      if (!curso) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Curso no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: curso }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener el curso" }));
      return true;
    }
  }

  // POST: Crear un nuevo curso
  if (url === "/api/cursos" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await cursoService.crearCurso(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Curso creado", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al crear curso";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar un curso
  if (url.startsWith("/api/cursos/") && req.method === "PUT") {
    try {
      const id = parseInt(url.split("/")[3]);
      const body = await parseBody(req);
      const actualizado = await cursoService.actualizarCurso(id, body);
      
      if (!actualizado) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Curso no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Curso actualizado" }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al actualizar";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar un curso
  if (url.startsWith("/api/cursos/") && req.method === "DELETE") {
    try {
      const id = parseInt(url.split("/")[3]);
      const eliminado = await cursoService.eliminarCurso(id);
      
      if (!eliminado) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Curso no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Curso eliminado" }));
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