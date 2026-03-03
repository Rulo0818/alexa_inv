"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = exports.generarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
// Generar token
const generarToken = (usuario) => {
    return jsonwebtoken_1.default.sign(usuario, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};
exports.generarToken = generarToken;
// Verificar token
const verificarToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verificarToken = verificarToken;
