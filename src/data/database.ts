import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear el pool de conexiones
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa a MySQL');
    connection.release();
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    process.exit(1);
  }
}