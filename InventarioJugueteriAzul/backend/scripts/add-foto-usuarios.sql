-- Agregar columna foto_url a usuarios para almacenar la ruta de la imagen del empleado
-- Ejecutar una sola vez. Si la columna ya existe, ignorar el error.
ALTER TABLE usuarios ADD COLUMN foto_url VARCHAR(500) NULL DEFAULT NULL;
