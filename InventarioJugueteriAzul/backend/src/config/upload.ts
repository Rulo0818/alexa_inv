import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'empleados');

// Crear directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Solo se permiten imágenes JPG, PNG o WebP'));
};

// Para crear empleado (sin id aún)
const storageCrear = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i) || ['.jpg'])[1]?.toLowerCase() || '.jpg';
    cb(null, `empleado_${Date.now()}_${Math.random().toString(36).slice(2, 9)}${ext}`);
  },
});

// Para actualizar foto (con id)
const storageActualizar = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i) || ['.jpg'])[1]?.toLowerCase() || '.jpg';
    const id = (req as any).params?.id || Date.now();
    cb(null, `empleado_${id}_${Date.now()}${ext}`);
  },
});

export const uploadCrearEmpleado = multer({
  storage: storageCrear,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const uploadFotoEmpleado = multer({
  storage: storageActualizar,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const UPLOAD_EMPLEADOS_DIR = UPLOAD_DIR;
