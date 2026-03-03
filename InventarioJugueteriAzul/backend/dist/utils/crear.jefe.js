"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const crearJefe = async () => {
    try {
        const contrasena = 'Admin123';
        const hash = await bcrypt_1.default.hash(contrasena, 10);
        await (0, database_1.query)(`INSERT INTO usuarios 
       (id_rol, username, contrasena, nombre, apellido, requiere_cambio_contrasena, activo)
       VALUES (1, 'admin_jefeAJA', ?, 'Admin', 'Jefe', 0, 1)`, [hash]);
        console.log('✅ Jefe creado correctamente');
        console.log('👤 Username: admin_jefeAJA');
        console.log('🔑 Contraseña: Admin123');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};
crearJefe();
