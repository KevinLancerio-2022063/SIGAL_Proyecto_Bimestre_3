import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from '@routes/index';
import { errorMiddleware } from '@middlewares/errorMiddleware';
import { logger } from '@utils/logger';

export function createApp(): Express {
  const app = express();

  // Middlewares de seguridad
  app.use(helmet());
  app.use(cors());

  // Middlewares de parseo
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging de requests
  app.use((req, express, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Rutas API
  app.use('/api', apiRoutes);

  // Ruta de salud
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
    });
  });

  // Manejo de rutas no encontradas
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
      timestamp: new Date().toISOString(),
    });
  });

  // Middleware de errores (debe ser el último)
  app.use(errorMiddleware);

  return app;
}