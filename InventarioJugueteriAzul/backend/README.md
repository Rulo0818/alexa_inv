# Backend - Inventario Juguetería Azul

API REST en Node.js + Express + TypeScript para el sistema de gestión de inventario.

## Requisitos

- **Node.js** 18 o superior
- **MySQL** 8 (o MariaDB) con la base de datos `jugueteria_azul` creada

## Cómo iniciar el backend

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y edita `.env` con tu configuración de MySQL:

```bash
# En la raíz del proyecto backend ya existe .env
# Ajusta si es necesario:
# PORT=3000
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=tu_password
# DB_NAME=jugueteria_azul
# JWT_SECRET=mi_clave_super_secreta_jugueteria_azul_2024
# JWT_EXPIRES_IN=8h
```

### 3. Crear la base de datos

En MySQL ejecuta (o usa el script de migraciones si existe):

```sql
CREATE DATABASE IF NOT EXISTS jugueteria_azul;
```

### 4. Arrancar el servidor

**Modo desarrollo** (reinicio automático con nodemon):

```bash
npm run dev
```

**Modo producción** (compilar y ejecutar):

```bash
npm run build
npm start
```

El servidor quedará disponible en **http://localhost:3000**.

### 5. Comprobar que funciona

- Navegador: http://localhost:3000 → mensaje de bienvenida de la API
- Health: http://localhost:3000/health → estado de la conexión a la base de datos

## Rutas principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/auth/login | Inicio de sesión (username, contrasena) |
| GET    | /api/ventas/estadisticas/resumen | Resumen ventas (requiere JWT, rol jefe) |
| GET    | /api/productos/estadisticas/inventario | Estadísticas de inventario (requiere JWT, rol jefe) |

El frontend Angular debe apuntar a `http://localhost:3000` para consumir esta API.
