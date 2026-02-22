"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', auth_controller_1.default.login.bind(auth_controller_1.default));
// POST /api/auth/cambiar-contrasena
router.post('/cambiar-contrasena', auth_middleware_1.verificarAutenticacion, auth_controller_1.default.cambiarContrasena.bind(auth_controller_1.default));
// POST /api/auth/logout
router.post('/logout', auth_middleware_1.verificarAutenticacion, auth_controller_1.default.logout.bind(auth_controller_1.default));
exports.default = router;
