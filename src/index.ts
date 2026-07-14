import express, { Application, Request, Response } from 'express';
import { testConnection } from './data/database';
import usuarioRoutes from './routes/usuarioRoutes';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Middleware CORS para permitir peticiones desde el frontend (Angular)
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Ruta de prueba para verificar que el servidor está activo
app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'SIGAL API corriendo' });
});

// Registrar las rutas de usuario bajo el prefijo /api
app.use('/api', usuarioRoutes);

// Manejador de rutas no encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Iniciar el servidor y probar la conexión a la base de datos
async function startServer(): Promise<void> {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
}

startServer();