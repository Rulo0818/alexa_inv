"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const empleados_routes_1 = __importDefault(require("./routes/empleados.routes"));
const categorias_routes_1 = __importDefault(require("./routes/categorias.routes"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const ventas_routes_1 = __importDefault(require("./routes/ventas.routes"));
const historial_routes_1 = __importDefault(require("./routes/historial.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Archivos estáticos (fotos de empleados)
app.use('/uploads/empleados', express_1.default.static('uploads/empleados'));
// Rutas
app.use('/api/auth', auth_routes_1.default);
app.use('/api/empleados', empleados_routes_1.default);
app.use('/api/categorias', categorias_routes_1.default);
app.use('/api/productos', productos_routes_1.default);
app.use('/api/ventas', ventas_routes_1.default);
app.use('/api/historial-acciones', historial_routes_1.default);
// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🧸 API Juguetería Azul funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});
// Ruta health
app.get('/health', async (req, res) => {
    try {
        await (0, database_1.testConnection)();
        res.json({
            success: true,
            message: 'Base de datos conectada correctamente',
            database: process.env.DB_NAME
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al conectar con la base de datos'
        });
    }
});
// Iniciar servidor
const startServer = async () => {
    try {
        console.log('Verificando conexión a MySQL...');
        await (0, database_1.testConnection)();
        console.log(`Conectado a: ${process.env.DB_HOST}:${process.env.DB_PORT} / ${process.env.DB_NAME}`);
        app.listen(PORT, () => {
            console.log('==========================================');
            console.log('🧸 Servidor Juguetería Azul iniciado');
            console.log(`🚀 Puerto: ${PORT}`);
            console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
            console.log('==========================================');
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar servidor:', error?.message || error);
        console.error('   Asegúrate de que MySQL esté corriendo y las credenciales en .env sean correctas.');
        process.exit(1);
    }
};
startServer();
exports.default = app;
