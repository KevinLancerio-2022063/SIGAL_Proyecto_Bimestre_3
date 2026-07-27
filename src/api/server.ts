import { createServer as httpCreateServer, IncomingMessage, ServerResponse } from 'http';
import { router } from './router';

// Crea y configura el servidor HTTP nativo
export const createServer = () => {
  const servidor = httpCreateServer((req: IncomingMessage, res: ServerResponse) => {
    const url = req.url || '/';

    // Configuración de cabeceras CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    // Manejo de pre-flight de CORS
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Delegamos el enrutamiento
    router(req, res, url);
  });

  return servidor;
};