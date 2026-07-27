import { createServer } from './api/server';
import { testConnection } from './data/database';

// Función principal de arranque
async function startServer(): Promise<void> {
  try {
    // Probamos la conexión a la base de datos
    await testConnection();
    
    // Creamos el servidor HTTP nativo
    const servidor = createServer();
    const PORT = process.env.PORT || 3000;
    
    // Iniciamos la escucha en el puerto
    servidor.listen(PORT, () => {
      console.log('====================================');
      console.log(` Servidor nativo corriendo en puerto ${PORT}`);
      console.log(` URL: http://localhost:${PORT}`);
      console.log(` API: http://localhost:${PORT}/api`);
      console.log('====================================');
    });
    
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
}

startServer();