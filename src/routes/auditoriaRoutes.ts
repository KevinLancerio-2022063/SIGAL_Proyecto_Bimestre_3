import { IncomingMessage, ServerResponse } from "http";
import { AuditoriaService } from "../services/AuditoriaService";

const auditoriaService = new AuditoriaService();

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

// Función que maneja las rutas de auditoría
export const auditoriaRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todos los registros
  if (url === "/api/auditoria" && req.method === "GET") {
    try {
      const registros = await auditoriaService.obtenerTodos();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: registros, total: registros.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener registros de auditoría" }));
      return true;
    }
  }

  // POST: Registrar un nuevo evento
  if (url === "/api/auditoria" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await auditoriaService.registrarAuditoria(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Evento de auditoría registrado", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al registrar evento";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  return false;
};