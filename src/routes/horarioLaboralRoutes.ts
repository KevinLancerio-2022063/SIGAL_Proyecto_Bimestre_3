import { IncomingMessage, ServerResponse } from "http";
import { HorarioLaboralService } from "../services/HorarioLaboralService";

const horarioService = new HorarioLaboralService();

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

// Función que maneja las rutas de horario laboral
export const horarioLaboralRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar horarios por estudiante (?id_estudiante=X)
  if (url === "/api/horarios-laborales" && req.method === "GET") {
    try {
      const urlParams = new URL(req.url || "", "http://localhost").searchParams;
      const idEstudiante = parseInt(urlParams.get("id_estudiante") || "0");
      
      if (!idEstudiante) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Se requiere el parámetro id_estudiante" }));
        return true;
      }

      const horarios = await horarioService.obtenerPorEstudiante(idEstudiante);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: horarios, total: horarios.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener horarios" }));
      return true;
    }
  }

  // GET: Obtener horario por ID
  if (url.startsWith("/api/horarios-laborales/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const horario = await horarioService.obtenerPorId(id);
      
      if (!horario) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Horario no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: horario }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener el horario" }));
      return true;
    }
  }

  // POST: Crear un nuevo horario laboral
  if (url === "/api/horarios-laborales" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await horarioService.crearHorarioLaboral(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Horario laboral creado", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al crear horario";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar un horario laboral
  if (url.startsWith("/api/horarios-laborales/") && req.method === "PUT") {
    try {
      const id = parseInt(url.split("/")[3]);
      const body = await parseBody(req);
      const actualizado = await horarioService.actualizarHorarioLaboral(id, body);
      
      if (!actualizado) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Horario no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Horario laboral actualizado" }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al actualizar";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar un horario laboral
  if (url.startsWith("/api/horarios-laborales/") && req.method === "DELETE") {
    try {
      const id = parseInt(url.split("/")[3]);
      const eliminado = await horarioService.eliminarHorarioLaboral(id);
      
      if (!eliminado) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Horario no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Horario laboral eliminado" }));
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