import { showMainMenu } from './menu/menuPrincipal';
import { createServer } from './api/server';
import { testConnection } from './data/database';

// Inicia el servidor HTTP
const startServer = async () => {
    const servidor = createServer();
    const PORT = process.env.PORT || 3000;
    servidor.listen(PORT, () => {
        console.log(`Servidor HTTP corriendo en http://localhost:${PORT}`);
        console.log("Presiona Ctrl+C para detener.");
    });
};

// Punto de entrada principal
const main = async () => {
    // 1. Conectar a BD primero
    await testConnection();

    // 2. Mostrar menú inicial
    const mode = await showMainMenu();

    // 3. Si el usuario eligió servidor HTTP
    if (mode === 'SERVER') {
        await startServer();
    }
};

main();