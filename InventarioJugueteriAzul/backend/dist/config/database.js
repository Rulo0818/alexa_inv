"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.testConnection = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Crear pool de conexiones
exports.pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jugueteria_azul',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});
// Función para verificar conexión
const testConnection = async () => {
    try {
        const connection = await exports.pool.getConnection();
        console.log('✅ Conexión a MySQL exitosa');
        connection.release();
    }
    catch (error) {
        console.error('❌ Error al conectar a MySQL:', error?.message || error);
        console.error('   Verifica: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME en .env');
        throw error;
    }
};
exports.testConnection = testConnection;
// Función para ejecutar queries
const query = async (sql, params) => {
    try {
        const [results] = await exports.pool.execute(sql, params);
        return results;
    }
    catch (error) {
        console.error('Error en query:', error);
        throw error;
    }
};
exports.query = query;
exports.default = exports.pool;
