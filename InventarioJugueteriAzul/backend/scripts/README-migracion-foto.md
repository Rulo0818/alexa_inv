# Migración: columna foto_url

Para habilitar las fotos de empleados, ejecuta una vez este script SQL en tu base de datos:

```sql
ALTER TABLE usuarios ADD COLUMN foto_url VARCHAR(500) NULL DEFAULT NULL;
```

Si la columna ya existe, MySQL mostrará un error (puedes ignorarlo).
