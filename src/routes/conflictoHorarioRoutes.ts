import { IncomingMessage, ServerResponse } from "http";
import { ConflictoHorarioService } from "../services/ConflictoHorarioService";

const conflictoService = new ConflictoHorarioService();

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

// Función que maneja las rutas de conflicto horario
export const conflictoHorarioRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar conflictos por estudiante (?id_estudiante=X)
  if (url === "/api/conflictos-horario" && req.method === "GET") {
    try {
      const urlParams = new URL(req.url || "", "http://localhost").searchParams;
      const idEstudiante = parseInt(urlParams.get("id_estudiante") || "0");
      
      if (!idEstudiante) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Se requiere el parámetro id_estudiante" }));
        return true;
      }

      const conflictos = await conflictoService.obtenerPorEstudiante(idEstudiante);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: conflictos, total: conflictos.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener conflictos" }));
      return true;
    }
  }

  // GET: Obtener conflicto por ID
  if (url.startsWith("/api/conflictos-horario/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const conflicto = await conflictoService.obtenerPorId(id);
      
      if (!conflicto) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Conflicto no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: conflicto }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener el conflicto" }));
      return true;
    }
  }

  // POST: Registrar un nuevo conflicto
  if (url === "/api/conflictos-horario" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await conflictoService.registrarConflicto(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Conflicto registrado", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al registrar conflicto";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Resolver un conflicto
  if (url.startsWith("/api/conflictos-horario/") && req.method === "PUT") {
    try {
      const id = parseInt(url.split("/")[3]);
      const body = await parseBody(req);
      const resuelto = await conflictoService.resolverConflicto(id, body);
      
      if (!resuelto) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Conflicto no encontrado" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Conflicto resuelto" }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al resolver";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  return false;
};