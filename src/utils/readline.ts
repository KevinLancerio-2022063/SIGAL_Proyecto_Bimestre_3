import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

// Creamos la interfaz usando promesas para poder usar async/await
export const rl = readline.createInterface({ input, output });

// Función auxiliar para hacer preguntas de forma asíncrona
export const ask = async (question: string): Promise<string> => {
    return await rl.question(question);
};

// Función para cerrar la interfaz al salir
export const closeRl = () => rl.close();