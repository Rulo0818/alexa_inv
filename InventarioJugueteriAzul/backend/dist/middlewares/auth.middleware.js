"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarJefe = exports.verificarAutenticacion = void 0;
const jwt_1 = require("../config/jwt");
// Middleware: Verificar token JWT
const verificarAutenticacion = (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No tienes autorización para acceder'
            });
            return;
        }
        // Extraer token
        const token = authHeader.split(' ')[1];
        // Verificar token
        const usuario = (0, jwt_1.verificarToken)(token);
        // Agregar usuario al request
        req.usuario = usuario;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};
exports.verificarAutenticacion = verificarAutenticacion;
// Middleware: Verificar rol de jefe
const verificarJefe = (req, res, next) => {
    if (!req.usuario) {
        res.status(401).json({
            success: false,
            message: 'No autenticado'
        });
        return;
    }
    if (req.usuario.nombre_rol !== 'jefe') {
        res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
        return;
    }
    next();
};
exports.verificarJefe = verificarJefe;
