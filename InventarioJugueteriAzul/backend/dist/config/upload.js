"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_EMPLEADOS_DIR = exports.uploadFotoEmpleado = exports.uploadCrearEmpleado = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const UPLOAD_DIR = path_1.default.join(process.cwd(), 'uploads', 'empleados');
// Crear directorio si no existe
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error('Solo se permiten imágenes JPG, PNG o WebP'));
};
// Para crear empleado (sin id aún)
const storageCrear = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i) || ['.jpg'])[1]?.toLowerCase() || '.jpg';
        cb(null, `empleado_${Date.now()}_${Math.random().toString(36).slice(2, 9)}${ext}`);
    },
});
// Para actualizar foto (con id)
const storageActualizar = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i) || ['.jpg'])[1]?.toLowerCase() || '.jpg';
        const id = req.params?.id || Date.now();
        cb(null, `empleado_${id}_${Date.now()}${ext}`);
    },
});
exports.uploadCrearEmpleado = (0, multer_1.default)({
    storage: storageCrear,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
exports.uploadFotoEmpleado = (0, multer_1.default)({
    storage: storageActualizar,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
exports.UPLOAD_EMPLEADOS_DIR = UPLOAD_DIR;
