import { IncomingMessage, ServerResponse } from "http";
import { SolicitudAjusteService } from "../services/SolicitudAjusteService";

const solicitudService = new SolicitudAjusteService();

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

// Función que maneja las rutas de solicitud de ajuste
export const solicitudAjusteRoutes = async (req: IncomingMessage, res: ServerResponse, url: string): Promise<boolean> => {
  
  // GET: Listar solicitudes por estudiante (?id_estudiante=X)
  if (url === "/api/solicitudes-ajuste" && req.method === "GET") {
    try {
      const urlParams = new URL(req.url || "", "http://localhost").searchParams;
      const idEstudiante = parseInt(urlParams.get("id_estudiante") || "0");
      
      if (!idEstudiante) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Se requiere el parámetro id_estudiante" }));
        return true;
      }

      const solicitudes = await solicitudService.obtenerPorEstudiante(idEstudiante);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: solicitudes, total: solicitudes.length }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener solicitudes" }));
      return true;
    }
  }

  // GET: Obtener solicitud por ID
  if (url.startsWith("/api/solicitudes-ajuste/") && req.method === "GET") {
    try {
      const id = parseInt(url.split("/")[3]);
      const solicitud = await solicitudService.obtenerPorId(id);
      
      if (!solicitud) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Solicitud no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: solicitud }));
      return true;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Error al obtener la solicitud" }));
      return true;
    }
  }

  // POST: Crear una nueva solicitud
  if (url === "/api/solicitudes-ajuste" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const nuevoId = await solicitudService.agregarSolicitud(body);
      
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Solicitud creada", data: { id: nuevoId } }));
      return true;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al crear solicitud";
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: mensaje }));
      return true;
    }
  }

  // PUT: Resolver una solicitud
  if (url.startsWith("/api/solicitudes-ajuste/") && req.method === "PUT") {
    try {
      const id = parseInt(url.split("/")[3]);
      const body = await parseBody(req);
      const resuelto = await solicitudService.resolverSolicitud(id, body);
      
      if (!resuelto) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Solicitud no encontrada" }));
        return true;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Solicitud resuelta" }));
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