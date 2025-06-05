-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: difficode
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id_curso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Fundamentos de programación','A través de ejercicios y ejemplos, aprenderás a pensar de manera lógica y estructurada para resolver problemas, sin necesidad de escribir código. Ideal para quienes desean comprender cómo funcionan los algoritmos, las estructuras de control y los procesos de resolución de problemas antes de comenzar con la programación práctica.');
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicio`
--

DROP TABLE IF EXISTS `ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicio` (
  `id_ejercicio` int NOT NULL AUTO_INCREMENT,
  `id_modulo` int DEFAULT NULL,
  `id_teoria` int DEFAULT NULL,
  `tipo` enum('test_simple','test_multiple','completar','codigo') DEFAULT NULL,
  `enunciado` text,
  `solucion` text,
  PRIMARY KEY (`id_ejercicio`),
  KEY `id_modulo` (`id_modulo`),
  KEY `id_teoria` (`id_teoria`),
  CONSTRAINT `ejercicio_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`),
  CONSTRAINT `ejercicio_ibfk_2` FOREIGN KEY (`id_teoria`) REFERENCES `teoria` (`id_teoria`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicio`
--

LOCK TABLES `ejercicio` WRITE;
/*!40000 ALTER TABLE `ejercicio` DISABLE KEYS */;
INSERT INTO `ejercicio` VALUES (1,1,1,'completar','<p><strong>Contexto:</strong><br>Imagina que tienes que crear un asistente digital que ayude a una persona a decidir qué hacer si está en casa, en función del clima y la hora del día. El asistente debe preguntarle a la persona si está lloviendo y si es hora de descansar o hacer actividad.</p>\n<p><strong>Instrucciones:</strong></p>\n<ul>\n  <li>Crea una lista de pasos lógicos que tu asistente debe seguir (utiliza una estructura condicional).</li>\n  <li>Si está lloviendo, el asistente debe recomendar llevar paraguas.</li>\n  <li>Si no está lloviendo, debe sugerir llevar gafas de sol.</li>\n  <li>Si es hora de descansar (por ejemplo, después de las 7 PM), el asistente debe recomendar descansar.</li>\n  <li>Si no es hora de descansar, el asistente debe sugerir hacer una actividad.</li>\n</ul>',''),(2,1,2,'test_simple',NULL,NULL),(3,1,3,'test_simple',NULL,NULL),(4,1,4,'test_simple',NULL,NULL),(5,1,5,'test_simple',NULL,NULL);
/*!40000 ALTER TABLE `ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadoejerciciousuario`
--

DROP TABLE IF EXISTS `estadoejerciciousuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadoejerciciousuario` (
  `id_usuario` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  `estado` enum('bloqueado','incompleto','erróneo','correcto') DEFAULT NULL,
  `repetido` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`id_ejercicio`),
  KEY `id_ejercicio` (`id_ejercicio`),
  CONSTRAINT `estadoejerciciousuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `estadoejerciciousuario_ibfk_2` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicio` (`id_ejercicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadoejerciciousuario`
--

LOCK TABLES `estadoejerciciousuario` WRITE;
/*!40000 ALTER TABLE `estadoejerciciousuario` DISABLE KEYS */;
INSERT INTO `estadoejerciciousuario` VALUES (1,1,'incompleto',0),(1,2,'bloqueado',0),(1,3,'bloqueado',0),(1,4,'bloqueado',0),(1,5,'bloqueado',0);
/*!40000 ALTER TABLE `estadoejerciciousuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulo` (
  `id_modulo` int NOT NULL AUTO_INCREMENT,
  `id_curso` int DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`id_modulo`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `modulo_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
INSERT INTO `modulo` VALUES (1,1,'Módulo 1: Introducción a la Lógica de Programación',1),(2,1,'Módulo 2: Tipos de Datos y Variables',2),(3,1,'Módulo 3: Estructuras de Control de Flujo',3);
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teoria`
--

DROP TABLE IF EXISTS `teoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teoria` (
  `id_teoria` int NOT NULL AUTO_INCREMENT,
  `id_modulo` int DEFAULT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `contenido` varchar(255) DEFAULT NULL,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`id_teoria`),
  KEY `id_modulo` (`id_modulo`),
  CONSTRAINT `teoria_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teoria`
--

LOCK TABLES `teoria` WRITE;
/*!40000 ALTER TABLE `teoria` DISABLE KEYS */;
INSERT INTO `teoria` VALUES (1,1,'¿Qué es la programación y por qué es importante la lógica?','teoria/M1L1.pdf',1),(2,1,'Pensamiento algorítmico y su relación con la programación.',NULL,2),(3,1,'Resolución de problemas: Desglosar problemas complejos en pasos sencillos.',NULL,3),(4,1,'Introducción a los algoritmos: Qué son y cómo estructurarlos.',NULL,4),(5,1,'Diagramas de flujo: Representación gráfica de algoritmos.',NULL,5);
/*!40000 ALTER TABLE `teoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Test','Test','2000-01-01','test@test.com','pbkdf2:sha256:600000$fIpUY5f2fR5O7AwN$fe69ef163fef1a80e5521a7f45e0e32c58f3e4c8bcbd25992c4b984d6b2b6c0d','img/profile/perfil_default.png'),(3,'Nuevo','Usuario','1995-10-20','nuevo@correo.com','scrypt:32768:8:1$9HxlOtCSnbXZ3Aht$c89afb26de725694fe21fd0c6ad24a7e6ea9134a0df5ac5f06da5a09ffe3dfc9520db81ae4fbb175866539b50d6de61574f635877857706bea752c35e4e063ec','img/profile/perfil_default.png'),(4,'David','Naranjo','2000-07-07','fmwab44@gmail.com','scrypt:32768:8:1$gZoQBAYH8olf3bg9$775f22ed628064d807627e86b147beeff99b1465df38e845700f053e40d0af38ba343bba69fa09d2f70b3a038e3d4f411270aab90aab1014ddd5a86d1d89a764','static/img/profile/mcDuck.jpeg');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_curso`
--

DROP TABLE IF EXISTS `usuario_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_curso` (
  `id_usuario` int NOT NULL,
  `id_curso` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_curso`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `usuario_curso_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `usuario_curso_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_curso`
--

LOCK TABLES `usuario_curso` WRITE;
/*!40000 ALTER TABLE `usuario_curso` DISABLE KEYS */;
INSERT INTO `usuario_curso` VALUES (1,1);
/*!40000 ALTER TABLE `usuario_curso` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05  8:08:29
