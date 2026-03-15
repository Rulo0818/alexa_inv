import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import authRoutes from './routes/auth.routes';
import empleadosRoutes from './routes/empleados.routes';
import categoriasRoutes from './routes/categorias.routes';
import productosRoutes from './routes/productos.routes';
import ventasRoutes from './routes/ventas.routes';
import historialRoutes from './routes/historial.routes';
import reportesRoutes from './routes/reportes.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (fotos de empleados)
app.use('/uploads/empleados', express.static('uploads/empleados'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/historial-acciones', historialRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🧸 API Juguetería Azul funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta health
app.get('/health', async (req: Request, res: Response) => {
  try {
    await testConnection();
    res.json({
      success: true,
      message: 'Base de datos conectada correctamente',
      database: process.env.DB_NAME
    });
  } catch (error) {
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
    await testConnection();
    console.log(`Conectado a: ${process.env.DB_HOST}:${process.env.DB_PORT} / ${process.env.DB_NAME}`);
    app.listen(PORT, () => {
      console.log('==========================================');
      console.log('🧸 Servidor Juguetería Azul iniciado');
      console.log(`🚀 Puerto: ${PORT}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
      console.log('==========================================');
    });
  } catch (error: any) {
    console.error('❌ Error al iniciar servidor:', error?.message || error);
    console.error('   Asegúrate de que MySQL esté corriendo y las credenciales en .env sean correctas.');
    process.exit(1);
  }
};

startServer();

export default app;