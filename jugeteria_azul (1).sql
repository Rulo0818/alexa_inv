-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 03-03-2026 a las 19:51:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jugeteria_azul`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `emoji` varchar(10) DEFAULT '?',
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `emoji`, `activo`, `fecha_creacion`) VALUES
(1, 'Muñecas', '🧸', 1, '2026-02-18 22:47:59'),
(2, 'Carros', '🚗', 1, '2026-02-18 22:47:59'),
(3, 'Juegos de mesa', '🎲', 1, '2026-02-18 22:47:59'),
(4, 'Peluches', '🐻', 1, '2026-02-18 22:47:59'),
(5, 'Pankeis', '🐻', 0, '2026-02-19 02:36:27'),
(6, 'cubos', '📦', 1, '2026-02-19 02:54:19'),
(7, 'pinturas', '🎨', 1, '2026-02-19 16:41:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_historial`
--

CREATE TABLE `detalles_historial` (
  `id` int(11) NOT NULL,
  `id_accion` int(11) NOT NULL,
  `campo_modificado` varchar(100) NOT NULL,
  `valor_anterior` varchar(500) DEFAULT NULL,
  `valor_nuevo` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalles_historial`
--

INSERT INTO `detalles_historial` (`id`, `id_accion`, `campo_modificado`, `valor_anterior`, `valor_nuevo`) VALUES
(1, 2, 'precio_de_venta', '550', '600'),
(3, 2, 'stock', '10', '15'),
(4, 1, 'total', '500', '540');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `precio_unitario` decimal(10,2) NOT NULL CHECK (`precio_unitario` > 0),
  `subtotal` decimal(10,2) NOT NULL CHECK (`subtotal` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(5, 5, 2, 1, 90.00, 90.00),
(6, 5, 3, 1, 600.00, 600.00),
(7, 5, 1, 1, 450.00, 450.00),
(8, 5, 4, 1, 380.00, 380.00),
(9, 6, 2, 4, 90.00, 360.00),
(10, 7, 5, 5, 380.00, 1900.00),
(11, 8, 2, 2, 90.00, 180.00),
(12, 8, 4, 1, 380.00, 380.00),
(13, 8, 5, 1, 380.00, 380.00),
(14, 9, 5, 1, 380.00, 380.00),
(15, 10, 2, 1, 90.00, 90.00),
(16, 10, 5, 1, 380.00, 380.00),
(17, 11, 2, 1, 90.00, 90.00),
(18, 12, 2, 1, 90.00, 90.00),
(19, 12, 3, 1, 600.00, 600.00),
(20, 12, 1, 1, 450.00, 450.00),
(21, 12, 4, 1, 380.00, 380.00),
(22, 13, 4, 1, 380.00, 380.00),
(23, 13, 1, 1, 450.00, 450.00),
(24, 13, 2, 1, 90.00, 90.00),
(25, 13, 3, 2, 600.00, 1200.00),
(26, 14, 7, 1, 350.00, 350.00),
(27, 15, 2, 1, 90.00, 90.00),
(28, 16, 2, 1, 90.00, 90.00),
(30, 18, 1, 1, 450.00, 450.00),
(31, 19, 7, 7, 350.00, 2450.00),
(32, 20, 3, 6, 600.00, 3600.00),
(33, 20, 7, 2, 350.00, 700.00),
(34, 21, 2, 7, 90.00, 630.00),
(35, 22, 2, 3, 90.00, 270.00);

--
-- Disparadores `detalle_ventas`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_despues_venta` AFTER INSERT ON `detalle_ventas` FOR EACH ROW BEGIN
  -- Restar del stock
  UPDATE productos 
  SET stock = stock - NEW.cantidad 
  WHERE id = NEW.id_producto;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `validar_stock_antes_venta` BEFORE INSERT ON `detalle_ventas` FOR EACH ROW BEGIN
  DECLARE stock_actual INT;
  
  -- Obtener stock actual del producto
  SELECT stock INTO stock_actual FROM productos WHERE id = NEW.id_producto;
  
  -- Validar que hay suficiente stock
  IF stock_actual < NEW.cantidad THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Stock insuficiente para completar la venta';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_acciones`
--

CREATE TABLE `historial_acciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_accion` enum('venta','venta_cancelada','producto_crear','producto_editar','producto_eliminar','usuario_crear','usuario_editar','usuario_resetear_password','categoria_crear','categoria_editar','categoria_eliminar','login') NOT NULL,
  `descripcion` text NOT NULL,
  `direccion_ip` varchar(45) DEFAULT NULL,
  `navegador` varchar(500) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `historial_acciones`
--

INSERT INTO `historial_acciones` (`id`, `id_usuario`, `tipo_accion`, `descripcion`, `direccion_ip`, `navegador`, `fecha_creacion`) VALUES
(5, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:09:33'),
(6, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:09:58'),
(7, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:10:01'),
(8, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:10:03'),
(9, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:10:05'),
(10, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:10:11'),
(11, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:10:15'),
(12, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:19:48'),
(13, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:31:15'),
(14, 10, 'venta', 'Realizó una venta de 4 productos por $1520.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:31:31'),
(15, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:31:57'),
(16, 10, 'venta', 'Realizó una venta de 1 producto por $360.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:32:11'),
(17, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:32:16'),
(18, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:36:53'),
(19, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:38:08'),
(20, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:38:14'),
(21, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:38:16'),
(22, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:46:11'),
(23, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:46:44'),
(24, 10, 'venta', 'Realizó una venta de 1 producto por $1900.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:47:16'),
(25, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:53:58'),
(26, 7, 'categoria_crear', 'Creó la categoría \"cubos\" 📦', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 02:54:19'),
(27, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:00:09'),
(28, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:05:22'),
(29, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:12:40'),
(30, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:23:06'),
(31, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:27:12'),
(32, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:36:47'),
(33, 7, 'usuario_crear', 'Creó el usuario Raul Polvo Montes (raul_polvo_montesEJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:37:36'),
(34, 7, 'usuario_editar', 'Editó el usuario Laura Martinez. Campos: activo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:39:29'),
(35, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:41:12'),
(36, 10, 'venta', 'Realizó una venta de 3 productos por $940.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:41:35'),
(37, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:41:51'),
(38, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:48:06'),
(39, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:50:27'),
(40, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:52:30'),
(41, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:53:55'),
(42, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:54:11'),
(43, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:55:21'),
(44, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:55:43'),
(45, 7, 'usuario_editar', 'Editó el usuario Ana Lopez. Campos: activo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:56:00'),
(46, 7, 'usuario_editar', 'Editó el usuario Miguel Hernandez. Campos: activo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:56:04'),
(47, 7, 'usuario_crear', 'Creó el usuario Raul Polvo Montes (raul_polvo_montesAJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 03:56:55'),
(48, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:02:47'),
(49, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:03:22'),
(50, 7, 'usuario_editar', 'Editó el usuario Raul Polvo Montes. Campos: activo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:03:50'),
(51, 7, '', 'Eliminó el usuario Raul Polvo Montes (raul_polvo_montesAJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:03:52'),
(52, 7, 'usuario_editar', 'Editó el usuario Raul Polvo Montes. Campos: activo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:04:01'),
(53, 7, '', 'Eliminó el usuario Raul Polvo Montes (raul_polvo_montesEJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:04:03'),
(54, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:05:28'),
(55, 10, 'venta', 'Realizó una venta de 1 producto por $380.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:05:35'),
(56, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 04:05:48'),
(57, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:29:32'),
(58, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:34:15'),
(59, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:35:14'),
(60, 10, 'venta', 'Realizó una venta de 2 productos por $470.00 (transferencia)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:35:36'),
(61, 10, 'venta', 'Realizó una venta de 1 producto por $90.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:35:54'),
(62, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:39:25'),
(63, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:39:32'),
(64, 7, 'usuario_crear', 'Creó el usuario Raul Polvo Montes (raul_polvo_montesAJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:39:53'),
(69, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:43:31'),
(71, 7, 'producto_eliminar', 'Eliminó el producto \"mini peka\" (J0005)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:44:27'),
(73, 7, 'categoria_eliminar', 'Eliminó la categoría \"Pankeis\"', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:44:47'),
(74, 7, 'categoria_eliminar', 'Eliminó la categoría \"Pankeis\"', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:44:50'),
(75, 7, 'categoria_eliminar', 'Eliminó la categoría \"Pankeis\"', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-19 16:44:57'),
(76, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:00:32'),
(77, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:00:39'),
(78, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:01:19'),
(79, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:01:24'),
(80, 7, '', 'Eliminó el usuario Raul Polvo Montes (raul_polvo_montesEJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:01:43'),
(81, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:06:22'),
(82, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:09:46'),
(83, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:15:22'),
(84, 10, 'venta', 'Realizó una venta de 4 productos por $1520.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:15:41'),
(85, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:24:29'),
(86, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:27:38'),
(87, 7, 'venta', 'Realizó una venta de 4 productos por $2120.00 (transferencia)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:28:03'),
(88, 7, 'producto_crear', 'Creó el producto \"cubo\" (J0006)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:30:37'),
(89, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:32:06'),
(90, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:33:18'),
(91, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:36:59'),
(92, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:37:23'),
(93, 7, 'venta', 'Realizó una venta de 1 producto por $350.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:37:32'),
(94, 7, 'venta', 'Realizó una venta de 1 producto por $90.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:37:41'),
(95, 7, 'categoria_eliminar', 'Eliminó la categoría \"Pankeis\"', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:40:29'),
(96, 7, 'categoria_eliminar', 'Eliminó la categoría \"Pankeis\"', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:40:33'),
(97, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:45:07'),
(98, 7, 'venta', 'Realizó una venta de 1 producto por $90.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:45:14'),
(99, 7, '', 'Eliminó el usuario Raul Polvo Montes (raul_polvo_montesAJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:48:50'),
(100, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:49:11'),
(101, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:50:25'),
(102, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:51:06'),
(103, 7, 'usuario_crear', 'Creó el usuario Raul Polvo (raul_polvoEJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:52:56'),
(106, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 01:56:26'),
(107, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:02:48'),
(108, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:03:22'),
(109, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:15:30'),
(110, 7, 'usuario_editar', 'Editó el usuario Raul Polvo. Campos: activo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:16:00'),
(111, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:23:23'),
(112, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:28:45'),
(113, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:40:18'),
(114, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:45:48'),
(115, 7, 'usuario_crear', 'Creó el usuario Raul Polvo (raul_polvoEJA)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:46:13'),
(116, 16, 'login', 'Raul Polvo inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:47:02'),
(117, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:51:28'),
(118, 16, 'login', 'Raul Polvo inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 02:53:34'),
(119, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:03:27'),
(120, 16, 'login', 'Raul Polvo inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:03:36'),
(121, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:17:15'),
(122, 16, 'login', 'Raul Polvo inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:18:38'),
(123, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:18:43'),
(124, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:22:57'),
(125, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:24:37'),
(126, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:25:16'),
(127, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:25:47'),
(128, 16, 'login', 'Raul Polvo inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:29:53'),
(129, 16, 'venta', 'Realizó una venta de 1 producto por $450.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:31:21'),
(130, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:31:29'),
(131, 16, 'venta', 'Realizó una venta de 1 producto por $2450.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:32:01'),
(132, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:32:06'),
(133, 7, 'usuario_editar', 'Editó el usuario Admin Jefe. Campos: nombre, apellido, edad, telefono, domicilio, activo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:33:08'),
(134, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:33:15'),
(135, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:38:59'),
(136, 16, 'login', 'Raul Polvo inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:39:43'),
(137, 16, 'venta', 'Realizó una venta de 2 productos por $4300.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:40:22'),
(138, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:40:28'),
(139, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:46:37'),
(140, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:46:56'),
(141, 7, 'venta', 'Realizó una venta de 1 producto por $630.00 (efectivo)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:47:19'),
(142, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:59:07'),
(143, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:59:30'),
(144, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:00:20'),
(145, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:00:44'),
(146, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:01:09'),
(147, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:01:23'),
(148, 7, 'producto_eliminar', 'Eliminó el producto \"cubo\" (J0006)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:02:05'),
(149, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:02:39'),
(150, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:05:11'),
(151, 7, 'producto_editar', 'Editó el producto \"Carro Hot Wheels\". Campos: nombre, id_categoria, precio_de_compra, precio_de_venta, stock, stock_minimo, estado, descuento_porcentaje', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:05:18'),
(152, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:05:35'),
(153, 7, 'producto_eliminar', 'Eliminó el producto \"Oso de Peluche Grande\" (J0004)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:09:22'),
(154, 7, 'producto_editar', 'Editó el producto \"Carro Hot Wheels\". Campos: nombre, id_categoria, precio_de_compra, precio_de_venta, stock, stock_minimo, estado, descuento_porcentaje', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:09:29'),
(155, 7, 'producto_editar', 'Editó el producto \"Carro Hot Wheels\". Campos: nombre, id_categoria, precio_de_compra, precio_de_venta, stock, stock_minimo, estado, descuento_porcentaje', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 04:09:38'),
(156, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:08:27'),
(157, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:09:27'),
(158, 10, 'venta', 'Realizó una venta de 1 producto por $270.00 (transferencia)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:10:05'),
(159, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:10:09'),
(160, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:13:58'),
(161, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:14:22'),
(162, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:19:59'),
(163, 7, 'categoria_eliminar', 'Eliminó la categoría \"Pankeis\"', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:20:08'),
(164, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 20:20:31'),
(165, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-02-26 17:58:01'),
(166, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-02-26 17:58:31'),
(167, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-02-26 18:09:47'),
(168, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:11:12'),
(169, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:13:25'),
(170, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:15:20'),
(171, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:17:48'),
(172, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:22:14'),
(173, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:30:20'),
(174, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:32:01'),
(175, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:41:57'),
(176, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:48:14'),
(177, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:54:51'),
(178, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 18:58:02'),
(179, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 19:00:53'),
(180, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-02-26 19:04:00'),
(181, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 19:10:24'),
(182, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 19:11:41'),
(183, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 19:12:03'),
(184, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-26 19:19:11'),
(185, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-03-02 16:31:32'),
(186, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-03-02 16:31:55'),
(187, 10, 'login', 'Empleado Uno inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.109.5 Chrome/142.0.7444.265 Electron/39.3.0 Safari/537.36', '2026-03-02 16:32:41'),
(188, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-03-02 16:39:05'),
(189, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-03-02 16:40:44'),
(190, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-03-03 16:17:58'),
(191, 7, 'login', 'Admin Jefe inició sesión', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-03-03 16:23:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `precio_de_compra` decimal(10,2) NOT NULL CHECK (`precio_de_compra` > 0 and `precio_de_compra` <= 13000),
  `precio_de_venta` decimal(10,2) NOT NULL CHECK (`precio_de_venta` > 0 and `precio_de_venta` <= 13000),
  `stock` int(11) DEFAULT 0 CHECK (`stock` >= 0 and `stock` <= 50),
  `stock_minimo` int(11) DEFAULT 5 CHECK (`stock_minimo` >= 0 and `stock_minimo` <= 50),
  `estado` enum('bueno','malo') DEFAULT 'bueno',
  `descuento_porcentaje` int(11) DEFAULT 0 CHECK (`descuento_porcentaje` >= 0 and `descuento_porcentaje` <= 100),
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `codigo`, `nombre`, `id_categoria`, `precio_de_compra`, `precio_de_venta`, `stock`, `stock_minimo`, `estado`, `descuento_porcentaje`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'J0001', 'Muñeca Barbie', 1, 300.00, 450.00, 15, 5, 'bueno', 10, 1, '2026-02-18 22:48:01', '2026-02-20 03:31:21'),
(2, 'J0002', 'Carro Hot Wheels', 2, 50.00, 90.00, 7, 5, 'bueno', 0, 1, '2026-02-18 22:48:01', '2026-02-20 20:10:05'),
(3, 'J0003', 'Monopoly Clasico', 3, 350.00, 600.00, 4, 5, 'bueno', 5, 1, '2026-02-18 22:48:01', '2026-02-20 03:40:22'),
(4, 'J0004', 'Oso de Peluche Grande', 4, 200.00, 380.00, 5, 5, 'bueno', 15, 0, '2026-02-18 22:48:01', '2026-02-20 04:09:22'),
(5, 'J0005', 'mini peka', 5, 200.00, 380.00, 2, 5, 'bueno', 15, 0, '2026-02-19 02:43:03', '2026-02-19 16:44:27'),
(7, 'J0006', 'cubo', 6, 100.00, 350.00, 0, 5, 'bueno', 0, 0, '2026-02-20 01:30:37', '2026-02-20 04:02:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre_rol`, `descripcion`, `fecha_creacion`) VALUES
(1, 'jefe', 'Administrador con acceso completo al sistema', '2026-02-18 22:41:48'),
(2, 'empleado', 'Vendedor con acceso solo a ventas', '2026-02-18 22:41:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secuencia_productos`
--

CREATE TABLE `secuencia_productos` (
  `id` int(11) NOT NULL,
  `ultimo_numero` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `secuencia_productos`
--

INSERT INTO `secuencia_productos` (`id`, `ultimo_numero`) VALUES
(1, 6),
(2, 10),
(3, 11),
(4, 12),
(5, 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `direccion_ip` varchar(45) DEFAULT NULL,
  `navegador` text DEFAULT NULL,
  `ultima_actividad` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sesiones`
--

INSERT INTO `sesiones` (`id`, `id_usuario`, `token`, `direccion_ip`, `navegador`, `ultima_actividad`, `fecha_creacion`) VALUES
(5, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhZG1pbl8wNUVKQSIsIm5vbWJyZSI6IkFkbWluIiwiYXBlbGxpZG8iOiJKZWZlIiwiaWRfcm9sIjoxLCJub21icmVfcm9sIjoiamVmZSIsInJlcXVpZXJlX2NhbWJpb19jb250cmFzZW5hIjowLCJmb3RvX3VybCI6ImVtcGxlYWRvcy9lbXBsZWFkb183XzE3NzE1NTgzODgzMjUuanBnIiwiaWF0IjoxNzcyNTU1MDMwLCJleHAiOjE3NzI1ODM4MzB9.yHqWWXIG_Cr5bGS2g3r2-u-va7VOccHITUOYZOwHyzA', '::1', 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-03-03 16:23:50', '2026-02-19 02:09:33'),
(13, 10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoiZW1wbGVhZG9fMDFFSkEiLCJub21icmUiOiJFbXBsZWFkbyIsImFwZWxsaWRvIjoiVW5vIiwiaWRfcm9sIjoyLCJub21icmVfcm9sIjoiZW1wbGVhZG8iLCJyZXF1aWVyZV9jYW1iaW9fY29udHJhc2VuYSI6MCwiZm90b191cmwiOm51bGwsImlhdCI6MTc3MjQ2OTE2MSwiZXhwIjoxNzcyNDk3OTYxfQ._2VAPTe2BBuZgecPAguFjPMP4vaLQHb_d7HMDBVU8Oc', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.109.5 Chrome/142.0.7444.265 Electron/39.3.0 Safari/537.36', '2026-03-02 16:32:41', '2026-02-19 02:31:15'),
(78, 16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsInVzZXJuYW1lIjoicmF1bF9wb2x2b0VKQSIsIm5vbWJyZSI6IlJhdWwiLCJhcGVsbGlkbyI6IlBvbHZvIiwiaWRfcm9sIjoyLCJub21icmVfcm9sIjoiZW1wbGVhZG8iLCJyZXF1aWVyZV9jYW1iaW9fY29udHJhc2VuYSI6MSwiZm90b191cmwiOiJlbXBsZWFkb3MvZW1wbGVhZG9fMTZfMTc3MTU1NTU3NDAyMy5qcGciLCJpYXQiOjE3NzE1NTg3ODMsImV4cCI6MTc3MTU4NzU4M30.Jo1R362XAbGCUO7J50MxdMcpRUvqLLHPgshMkvHD2K8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-20 03:39:43', '2026-02-20 02:47:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `edad` int(11) DEFAULT NULL CHECK (`edad` >= 18 and `edad` <= 70),
  `telefono` varchar(20) DEFAULT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `requiere_cambio_contrasena` tinyint(1) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `foto_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `id_rol`, `username`, `contrasena`, `nombre`, `apellido`, `edad`, `telefono`, `domicilio`, `requiere_cambio_contrasena`, `activo`, `fecha_creacion`, `fecha_actualizacion`, `foto_url`) VALUES
(7, 1, 'admin_05EJA', '$2b$10$AkNgCHf7fgZ6yQX2xFPRm.nIzjK2bB12jpP3lvBfXasIaZqKiDOlu', 'Admin', 'Jefe', 22, '2461111111', 'calle principal', 0, 1, '2026-02-19 02:06:19', '2026-02-20 03:33:08', 'empleados/empleado_7_1771558388325.jpg'),
(10, 2, 'empleado_01EJA', '$2b$10$QVMG/SBXcjH8RvAT3bdz4OyCnbglNQ8FiRbeyENCeV6CnoMD/fZPG', 'Empleado', 'Uno', NULL, NULL, NULL, 0, 1, '2026-02-19 02:29:55', '2026-02-19 02:30:22', NULL),
(16, 2, 'raul_polvoEJA', '$2b$10$HrdVWzjsQF5TrUAtIxR9beb5YDXK03vYn0RWFJe7VZXgo7ONQwS2K', 'Raul', 'Polvo', 20, '2461772007', 'calle05', 1, 1, '2026-02-20 02:46:13', '2026-02-20 02:46:14', 'empleados/empleado_16_1771555574023.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL CHECK (`total` > 0),
  `metodo_pago` enum('efectivo','transferencia') NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `cancelada` tinyint(1) DEFAULT 0,
  `motivo_cancelacion` varchar(500) DEFAULT NULL,
  `cancelada_por` int(11) DEFAULT NULL,
  `fecha_cancelacion` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `id_empleado`, `total`, `metodo_pago`, `fecha`, `hora`, `cancelada`, `motivo_cancelacion`, `cancelada_por`, `fecha_cancelacion`, `fecha_creacion`) VALUES
(5, 10, 1520.00, 'efectivo', '2026-02-19', '20:31:31', 0, NULL, NULL, NULL, '2026-02-19 02:31:31'),
(6, 10, 360.00, 'efectivo', '2026-02-19', '20:32:11', 0, NULL, NULL, NULL, '2026-02-19 02:32:11'),
(7, 10, 1900.00, 'efectivo', '2026-02-19', '20:47:16', 0, NULL, NULL, NULL, '2026-02-19 02:47:16'),
(8, 10, 940.00, 'efectivo', '2026-02-19', '21:41:35', 0, NULL, NULL, NULL, '2026-02-19 03:41:35'),
(9, 10, 380.00, 'efectivo', '2026-02-19', '22:05:35', 0, NULL, NULL, NULL, '2026-02-19 04:05:35'),
(10, 10, 470.00, 'transferencia', '2026-02-19', '10:35:36', 0, NULL, NULL, NULL, '2026-02-19 16:35:36'),
(11, 10, 90.00, 'efectivo', '2026-02-19', '10:35:54', 0, NULL, NULL, NULL, '2026-02-19 16:35:54'),
(12, 10, 1520.00, 'efectivo', '2026-02-20', '19:15:41', 0, NULL, NULL, NULL, '2026-02-20 01:15:41'),
(13, 7, 2120.00, 'transferencia', '2026-02-20', '19:28:03', 0, NULL, NULL, NULL, '2026-02-20 01:28:03'),
(14, 7, 350.00, 'efectivo', '2026-02-20', '19:37:32', 0, NULL, NULL, NULL, '2026-02-20 01:37:32'),
(15, 7, 90.00, 'efectivo', '2026-02-20', '19:37:41', 0, NULL, NULL, NULL, '2026-02-20 01:37:41'),
(16, 7, 90.00, 'efectivo', '2026-02-19', '19:45:14', 0, NULL, NULL, NULL, '2026-02-20 01:45:14'),
(18, 16, 450.00, 'efectivo', '2026-02-19', '21:31:21', 0, NULL, NULL, NULL, '2026-02-20 03:31:21'),
(19, 16, 2450.00, 'efectivo', '2026-02-19', '21:32:01', 0, NULL, NULL, NULL, '2026-02-20 03:32:01'),
(20, 16, 4300.00, 'efectivo', '2026-02-19', '21:40:22', 0, NULL, NULL, NULL, '2026-02-20 03:40:22'),
(21, 7, 630.00, 'efectivo', '2026-02-19', '21:47:19', 0, NULL, NULL, NULL, '2026-02-20 03:47:19'),
(22, 10, 270.00, 'transferencia', '2026-02-20', '14:10:05', 0, NULL, NULL, NULL, '2026-02-20 20:10:05');

--
-- Disparadores `ventas`
--
DELIMITER $$
CREATE TRIGGER `restaurar_stock_cancelacion` AFTER UPDATE ON `ventas` FOR EACH ROW BEGIN
  IF OLD.cancelada = 0 AND NEW.cancelada = 1 THEN
    -- Restaurar el stock de todos los productos de esta venta
    UPDATE productos p
    INNER JOIN detalle_ventas dv ON p.id = dv.id_producto
    SET p.stock = p.stock + dv.cantidad
    WHERE dv.id_venta = NEW.id;
  END IF;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_activo` (`activo`);

--
-- Indices de la tabla `detalles_historial`
--
ALTER TABLE `detalles_historial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_accion` (`id_accion`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_venta` (`id_venta`),
  ADD KEY `idx_id_producto` (`id_producto`);

--
-- Indices de la tabla `historial_acciones`
--
ALTER TABLE `historial_acciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_usuario` (`id_usuario`),
  ADD KEY `idx_tipo_accion` (`tipo_accion`),
  ADD KEY `idx_fecha_creacion` (`fecha_creacion`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idx_codigo` (`codigo`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_id_categoria` (`id_categoria`),
  ADD KEY `idx_stock` (`stock`),
  ADD KEY `idx_activo` (`activo`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `secuencia_productos`
--
ALTER TABLE `secuencia_productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_id_usuario` (`id_usuario`),
  ADD KEY `idx_token` (`token`(255));

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `telefono` (`telefono`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_nombre` (`nombre`,`apellido`),
  ADD KEY `idx_id_rol` (`id_rol`),
  ADD KEY `idx_activo` (`activo`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cancelada_por` (`cancelada_por`),
  ADD KEY `idx_id_empleado` (`id_empleado`),
  ADD KEY `idx_fecha` (`fecha`),
  ADD KEY `idx_metodo_pago` (`metodo_pago`),
  ADD KEY `idx_cancelada` (`cancelada`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `detalles_historial`
--
ALTER TABLE `detalles_historial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `historial_acciones`
--
ALTER TABLE `historial_acciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=192;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `secuencia_productos`
--
ALTER TABLE `secuencia_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
