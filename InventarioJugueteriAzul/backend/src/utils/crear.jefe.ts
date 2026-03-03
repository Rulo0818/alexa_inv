import bcrypt from 'bcrypt';
import { query } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const crearJefe = async () => {
  try {
    const contrasena = 'Admin123';
    const hash = await bcrypt.hash(contrasena, 10);

    await query(
      `INSERT INTO usuarios 
       (id_rol, username, contrasena, nombre, apellido, requiere_cambio_contrasena, activo)
       VALUES (1, 'admin_jefeAJA', ?, 'Admin', 'Jefe', 0, 1)`,
      [hash]
    );

    console.log('✅ Jefe creado correctamente');
    console.log('👤 Username: admin_jefeAJA');
    console.log('🔑 Contraseña: Admin123');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};


crearJefe();