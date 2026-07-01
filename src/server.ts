import { createApp } from './app';
import { initializeDatabase, closeDatabase } from '@db/connection';
import { environment } from '@config/environment';
import { logger } from '@utils/logger';

async function startServer(): Promise<void> {
  try {
    // Inicializar base de datos
    await initializeDatabase();

    // Crear aplicación
    const app = createApp();

    // Iniciar servidor
    const PORT = environment.server.port;
    app.listen(PORT, () => {
      logger.info(
        `🚀 Servidor ejecutándose en puerto ${PORT} en modo ${environment.server.nodeEnv}`
      );
    });

    // Manejar shutdown graceful
    process.on('SIGINT', async () => {
      logger.info('Cerrando servidor...');
      await closeDatabase();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();