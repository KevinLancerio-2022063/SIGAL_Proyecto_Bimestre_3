import { IncomingMessage, ServerResponse } from "http";
import { OportunidadService } from "../services/OportunidadService";

const oportunidadService = new OportunidadService();

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

export const oportunidadRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar todas las oportunidades
  if (url === "/api/oportunidades" && req.method === "GET") {
    try {
      const oportunidades = await oportunidadService.obtenerTodas();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: oportunidades, total: oportunidades.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener oportunidades" }));
      return true;
    }
  }

  // GET: Obtener oportunidad por ID
  if (url.startsWith("/api/oportunidades/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const oportunidad = await oportunidadService.obtenerPorId(id);
      
      if (!oportunidad) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Oportunidad no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: oportunidad }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener la oportunidad" }));
      return true;
    }
  }

  // POST: Crear una nueva oportunidad
  if (url === "/api/oportunidades" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await oportunidadService.crearOportunidad(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Oportunidad creada", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al crear oportunidad";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Actualizar una oportunidad
  if (url.startsWith("/api/oportunidades/") && req.method === "PUT") {
    try {
      const id = parseInt(url.split("/")[3]);
      const body = await parseBody(req);
      const actualizada = await oportunidadService.actualizarOportunidad(id, body);
      
      if (!actualizada) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Oportunidad no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Oportunidad actualizada" }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al actualizar";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // DELETE: Eliminar una oportunidad
  if (url.startsWith("/api/oportunidades/") && req.method === "DELETE") {
    try {
      const id = parseInt(url.split("/")[3]);
      const eliminada = await oportunidadService.eliminarOportunidad(id);
      
      if (!eliminada) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Oportunidad no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Oportunidad eliminada" }));
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