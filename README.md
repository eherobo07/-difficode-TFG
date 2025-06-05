# !difficode — Plataforma de Aprendizaje de Lógica de Programación

##  Descripción del proyecto

**!difficode** es una plataforma web interactiva diseñada como Trabajo de Fin de Grado (TFG), 
orientada a enseñar lógica de programación desde cero. La aplicación permite a los usuarios avanzar de manera progresiva por módulos que combinan teoría y ejercicios prácticos, 
desbloqueando contenido según su progreso. La experiencia está diseñada para ser clara, accesible y profesional.

---

##  Tecnologías utilizadas

###  Frontend
- HTML5
- CSS3 (con diseño responsive y animaciones)
- JavaScript puro (sin frameworks)

###  Backend
- Python 3.11
- Flask 3.1.1
- MySQL
- Flask-MySQLdb
- `werkzeug.security` (para hash de contraseñas)
- Cookies y sesiones para autenticación

---

##  Estructura del proyecto
TFG/
├── static/
│ ├── css/
│ │ ├── index.css
│ │ ├── perfil.css
│ │ ├── curso.css
│ │ ├── teoria.css
│ │ └── ejercicio.css
│ ├── js/
│ │ ├── index.js
│ │ ├── perfil.js
│ │ ├── curso.js
│ │ ├── teoria.js
│ │ └── ejercicio.js
│ ├── img/
│ │ └── (logotipo, fotos de perfil, carrusel, etc.)
│ └── teoría/
│ └── M1L1.pdf
├── templates/
│ ├── index.html
│ ├── perfil.html
│ ├── curso.html
│ ├── teoria.html
│ └── ejercicio.html
├── app.py
├── db_config.py
├── init_db.sql
├── requirements.txt
└── README.md

---

## Funcionalidades principales

- ✅ Registro y login seguro con hash de contraseñas
- ✅ Inicio de sesión persistente mediante cookies de sesión
- ✅ Página de perfil editable con foto seleccionable
- ✅ Carga dinámica del curso según el usuario
- ✅ Progreso desbloqueado paso a paso mediante lógica de backend
- ✅ Ejercicios finales validados desde base de datos
- ✅ Feedback inmediato sobre los ejercicios
- ✅ Popup para reportar problemas y opción de borrar cuenta
- ✅ Animaciones y estilo responsive adaptado a escritorio y móvil

---

## Cómo ejecutar el proyecto localmente

1. **Clona (o descarga) este repositorio**

git clone https://github.com/tuusuario/tfg-difficode.git
cd tfg-difficode

2. **Instala los requisitos de Python**

pip install -r requirements.txt

3. **Configura la base de datos**

- Asegúrate de tener MySQL instalado
- Crea una base de datos (por ejemplo difficode)
- Ejecuta el script init_db.sql para crear todas las tablas necesarias
- Asegúrate de configurar correctamente el archivo db_config.py con tus credenciales de MySQL

4. **Ejecuta el servidor Flask**

python app.py

5. **Accede a la aplicación**

http://127.0.0.1:5000/

**Datos técnicos adicionales**
- Los ejercicios están almacenados en base de datos y gestionados por el backend, con campos como estado y repetido para controlar el progreso.
- El primer módulo está totalmente funcional y puede usarse como demostración.
- Las teorías se visualizan como PDF embebidos (en teoria.html), y los ejercicios en HTML (ejercicio.html).
- Las rutas protegidas verifican sesión activa en el backend.

**Estado actual del proyecto**
El proyecto se encuentra en fase ALFA.
Actualmente es totalmente funcional con el primer módulo completo y arquitectura preparada para escalar a más contenidos.
 
 **Futuras mejoras propuestas**
- Añadir más módulos y ejercicios
- Panel de administración de contenidos
- Sistema de progreso visual (estadísticas, badges)
- Compatibilidad con cuenta de profesor
- Comentarios y feedback por lección
- Validación avanzada de respuestas

**Autor:**
David Naranjo.
Trabajo de Fin de Grado (TFG) en Desarrollo de Aplicaciones Web
