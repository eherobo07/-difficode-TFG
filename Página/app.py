from flask import Flask, jsonify, render_template, request, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mysqldb import MySQL
from db_config import MYSQL_CONFIG


# =====================
# Inicialización de Flask
# =====================
app = Flask(__name__)
app.secret_key = "con_esta_clave_para_las_cookies_consigo_el10"

# =====================
# Configuración de MySQL
# =====================
app.config.update(
    MYSQL_HOST=MYSQL_CONFIG['host'],
    MYSQL_USER=MYSQL_CONFIG['user'],
    MYSQL_PASSWORD=MYSQL_CONFIG['password'],
    MYSQL_DB=MYSQL_CONFIG['database']
)

mysql = MySQL(app)

# =====================
# Rutas HTML (Frontend)
# =====================

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/perfil')
def perfil():
    return render_template('perfil.html')


# =====================
# API: CRUD de Usuario
# =====================

# Crear usuario (CREATE)
@app.route('/api/usuario', methods=['POST'])
def crear_usuario():
    data = request.get_json()

    # ✅ Convertimos la contraseña en un hash seguro
    hash_seguro = generate_password_hash(data['contraseña'])

    # 🛠️ Guardamos el hash en vez de la contraseña original
    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO Usuario (nombre, apellidos, fecha_nacimiento, correo, contraseña, foto_perfil)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data['nombre'],
        data['apellidos'],
        data['fecha_nacimiento'],
        data['correo'],
        hash_seguro,  # ✅ Aquí insertamos el hash, no la contraseña
        data.get('foto_perfil', 'img/profile/perfil_default.png')
    ))
    mysql.connection.commit()

    # Obtener el id del usuario recién creado
    cursor.execute("SELECT LAST_INSERT_ID()")
    id_usuario = cursor.fetchone()[0]

    # Asignamos el curso por defecto (id_curso = 1)
    cursor.execute("INSERT INTO Usuario_Curso (id_usuario, id_curso) VALUES (%s, %s)", (id_usuario, 1))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'mensaje': 'Usuario creado correctamente'}), 201


# Leer todos los usuarios (READ All)
@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM Usuario")
    usuarios = cursor.fetchall()
    columnas = [col[0] for col in cursor.description]
    cursor.close()
    return jsonify([dict(zip(columnas, u)) for u in usuarios])

# Leer un usuario por ID (READ One)
@app.route('/api/usuario/<int:usuario_id>', methods=['GET'])
def obtener_usuario(usuario_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM Usuario WHERE id_usuario = %s", (usuario_id,))
    usuario = cursor.fetchone()
    columnas = [col[0] for col in cursor.description]
    cursor.close()
    if usuario:
        return jsonify(dict(zip(columnas, usuario)))
    return jsonify({'error': 'Usuario no encontrado'}), 404

# Actualizar usuario (UPDATE)
@app.route('/api/usuario/<int:usuario_id>', methods=['PUT'])
def actualizar_usuario(usuario_id):
    data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE Usuario
        SET nombre = %s, apellidos = %s, fecha_nacimiento = %s, correo = %s, foto_perfil = %s
        WHERE id_usuario = %s
    """, (
        data['nombre'],
        data['apellidos'],
        data['fecha_nacimiento'],
        data['correo'],
        data.get('foto_perfil', 'img/profile/perfil_default.png'),
        usuario_id
    ))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'mensaje': 'Usuario actualizado correctamente'})

# Eliminar usuario (DELETE)
@app.route('/api/usuario/<int:usuario_id>', methods=['DELETE'])
def eliminar_usuario(usuario_id):
    cursor = mysql.connection.cursor()

    try:
        # 1. Eliminar las relaciones en la tabla usuario_curso
        cursor.execute("DELETE FROM usuario_curso WHERE id_usuario = %s", (usuario_id,))

        # 2. Eliminar los registros relacionados en la tabla EstadoEjercicioUsuario
        cursor.execute("DELETE FROM EstadoEjercicioUsuario WHERE id_usuario = %s", (usuario_id,))

        # 3. Ahora puedes eliminar el usuario
        cursor.execute("DELETE FROM Usuario WHERE id_usuario = %s", (usuario_id,))
        
        mysql.connection.commit()

        cursor.close()
        return jsonify({'mensaje': 'Usuario eliminado correctamente'})

    except Exception as e:
        mysql.connection.rollback()  # En caso de error, revertir todo
        cursor.close()
        print(f"Error: {e}")  # Esto imprimirá el error en la terminal para depuración
        return jsonify({'error': str(e)}), 500


# =====================
# API: Gestión del Login
# =====================

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    contraseña = data.get('contraseña')

    if not correo or not contraseña:
        return jsonify({'error': 'Faltan datos'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM Usuario WHERE correo = %s", (correo,))
    usuario = cursor.fetchone()
    columnas = [col[0] for col in cursor.description]
    cursor.close()

    if usuario:
        usuario_dict = dict(zip(columnas, usuario))
        hash_guardado = usuario_dict['contraseña']

        if check_password_hash(hash_guardado, contraseña):
            # Guardamos en sesión lo necesario (id y nombre, por ejemplo)
            session['usuario_id'] = usuario_dict['id_usuario']
            session['nombre'] = usuario_dict['nombre']
            return jsonify({'mensaje': 'Login correcto'})
        else:
            return jsonify({'error': 'Contraseña incorrecta'}), 401
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

# ==============================
# API: Gestión del GET de sesión
# =============================

@app.route('/api/sesion', methods=['GET'])
def obtener_sesion():
    usuario_id = session.get('usuario_id')

    if not usuario_id:
        return jsonify({'error': 'No hay sesión activa'}), 401

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM Usuario WHERE id_usuario = %s", (usuario_id,))
    usuario = cursor.fetchone()
    columnas = [col[0] for col in cursor.description]
    cursor.close()

    if usuario:
        usuario_dict = dict(zip(columnas, usuario))
        # ⚠️ No devolvemos la contraseña por seguridad
        usuario_dict.pop('contraseña', None)
        return jsonify(usuario_dict)
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

# =====================
# API: Cerrar sesión
# =====================
@app.route('/api/logout', methods=['GET'])
def logout():
    session.clear()  # ✅ Elimina todos los datos de la sesión
    return jsonify({'mensaje': 'Sesión cerrada correctamente'}), 200

# =====================
# API: Obtener curso completo para el usuario logueado
# =====================
@app.route('/api/curso', methods=['GET'])
def obtener_curso_completo():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({'error': 'No hay sesión activa'}), 401

    cursor = mysql.connection.cursor()

    # 1. Obtener el curso del usuario
    cursor.execute("""
        SELECT C.id_curso, C.nombre, C.descripcion
        FROM Curso C
        JOIN Usuario_Curso UC ON C.id_curso = UC.id_curso
        WHERE UC.id_usuario = %s
    """, (usuario_id,))
    curso = cursor.fetchone()

    if not curso:
        cursor.close()
        return jsonify({'error': 'El usuario no tiene curso asignado'}), 404

    curso_id, curso_nombre, curso_descripcion = curso

    # 2. Obtener todos los módulos del curso
    cursor.execute("""
        SELECT id_modulo, nombre, orden
        FROM Modulo
        WHERE id_curso = %s
        ORDER BY orden ASC
    """, (curso_id,))
    modulos_raw = cursor.fetchall()

    modulos = []

    for modulo in modulos_raw:
        id_modulo, nombre_modulo, orden_modulo = modulo

        # 3. Obtener teorías del módulo
        cursor.execute("""
            SELECT id_teoria, titulo, contenido, orden
            FROM Teoria
            WHERE id_modulo = %s
            ORDER BY orden ASC
        """, (id_modulo,))
        teorias = [
            {'id': t[0], 'titulo': t[1], 'contenido': t[2], 'orden': t[3]}
            for t in cursor.fetchall()
        ]

        # 4. Obtener ejercicios FINALES del módulo (los que no tienen teoría asociada)
        cursor.execute("""
            SELECT E.id_ejercicio, E.id_teoria, E.tipo, E.enunciado, E.solucion,
                   EU.estado, EU.repetido
            FROM Ejercicio E
            LEFT JOIN EstadoEjercicioUsuario EU ON E.id_ejercicio = EU.id_ejercicio AND EU.id_usuario = %s
            WHERE E.id_modulo = %s
            ORDER BY E.id_ejercicio ASC
        """, (usuario_id, id_modulo))
        ejercicios = cursor.fetchall()

        ejercicios_list = []
        for e in ejercicios:
            ejercicio = {
                'id': e[0],
                'id_teoria': e[1],
                'tipo': e[2],
                'enunciado': e[3],
                'solucion': e[4],
                'estado': e[5],
                'repetido': bool(e[6]) if e[6] is not None else False
            }
            ejercicios_list.append(ejercicio)

        modulos.append({
            'id': id_modulo,
            'nombre': nombre_modulo,
            'orden': orden_modulo,
            'teorias': teorias,
            'ejercicios': ejercicios_list
        })

    cursor.close()

    # 5. Inicializar estados si no existían
    ejercicios_totales = sum(len(m['ejercicios']) for m in modulos)
    estados_asignados = sum(1 for m in modulos for e in m['ejercicios'] if e['estado'] is not None)

    if estados_asignados == 0 and ejercicios_totales > 0:
        cursor = mysql.connection.cursor()
        todos_ejercicios = [(e['id'], m['orden']) for m in modulos for e in m['ejercicios']]

        for i, (id_ejercicio, orden_modulo) in enumerate(todos_ejercicios):
            estado = 'incompleto' if i == 0 else 'bloqueado'
            cursor.execute("""
                INSERT INTO EstadoEjercicioUsuario (id_usuario, id_ejercicio, estado, repetido)
                VALUES (%s, %s, %s, %s)
            """, (usuario_id, id_ejercicio, estado, False))

        mysql.connection.commit()
        cursor.close()

        # Llamada recursiva para devolver los datos una vez inicializados
        return obtener_curso_completo()

    # 6. Respuesta final con la estructura correcta
    return jsonify({
        'id_curso': curso_id,
        'nombre': curso_nombre,
        'descripcion': curso_descripcion,
        'modulos': modulos
    })

# ============================
# Validar sesión al cargar el curso
# ============================
@app.route('/curso')
def curso():
    # Verificar si hay una sesión activa
    usuario_id = session.get('usuario_id')
    
    if not usuario_id:
        return render_template('index.html')  # Redirigir al login si no hay sesión activa

    # Si la sesión es válida, cargar la página del curso
    return render_template('curso.html')


# ========================
# Acceso a la teoría
# ========================
@app.route('/teoria/<int:id_teoria>')
def teoria(id_teoria):
    # Verifica si la sesión está activa
    if 'usuario_id' not in session:
        return redirect(url_for('index'))  # Redirige a la ruta / (index), no a index.html
    # Si la sesión está activa, carga la teoría
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT contenido, titulo FROM Teoria WHERE id_teoria = %s", (id_teoria,))
    teoria = cursor.fetchone()
    cursor.close()

    if teoria:
        pdf_url = "/static/" + teoria[0]  # Aquí "contenido" es la ruta relativa del PDF
        return render_template('teoria.html', pdf_url=pdf_url, titulo=teoria[1])
    else:
        return jsonify({'error': 'Teoría no encontrada'}), 404
    

# ============================
# Gestión de ejercicios y corrección
# ============================

@app.route('/ejercicio/<int:id_ejercicio>')
def ejercicio(id_ejercicio):
    # Verifica si la sesión está activa
    if 'usuario_id' not in session:
        return redirect(url_for('index'))  # Redirige a la ruta / (index), no a index.html
    
    # Si la sesión está activa, carga el ejercicio
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT enunciado, solucion, tipo FROM Ejercicio WHERE id_ejercicio = %s", (id_ejercicio,))
    ejercicio = cursor.fetchone()
    cursor.close()

    if ejercicio:
        # Aquí "enunciado" es el contenido que mostramos al usuario
        enunciado = ejercicio[0]
        solucion = ejercicio[1]
        tipo = ejercicio[2]  # Puede ser tipo: 'pregunta', 'respuesta corta', etc.
        
        # Aquí puedes decidir cómo quieres mostrar la solución o el enunciado
        return render_template('ejercicio.html', enunciado=enunciado, solucion=solucion, tipo=tipo)
    else:
        return jsonify({'error': 'Ejercicio no encontrado'}), 404

@app.route('/api/ejercicio/validar', methods=['POST'])
def validar_ejercicio():
    data = request.get_json()
    id_usuario = session.get('usuario_id')

    if not id_usuario:
        return jsonify({'error': 'No hay sesión activa'}), 401

    id_ejercicio = data.get('id_ejercicio')
    respuesta_usuario = data.get('respuesta', '').strip()

    if not id_ejercicio:
        return jsonify({'error': 'ID de ejercicio no proporcionado'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT solucion FROM Ejercicio WHERE id_ejercicio = %s", (id_ejercicio,))
    ejercicio = cursor.fetchone()

    if not ejercicio:
        cursor.close()
        return jsonify({'error': 'Ejercicio no encontrado'}), 404

    solucion_correcta = ejercicio[0]

    # === ✅ CASO ESPECIAL: ejercicio 1 ===
    if int(id_ejercicio) == 1:
        if respuesta_usuario == "":
            return jsonify({'error': 'Por favor, escribe algo para validar tu lógica.'}), 400

        # Marcamos como correcto sin comparar con la solución
        cursor.execute("""
            UPDATE EstadoEjercicioUsuario
            SET estado = 'correcto', repetido = TRUE
            WHERE id_usuario = %s AND id_ejercicio = %s
        """, (id_usuario, id_ejercicio))
        mysql.connection.commit()
        cursor.close()

        return jsonify({
            'mensaje': '¡Cualquier respuesta es válida en este caso si se sigue una lógica de programación! Esperamos que le hayas echado imaginación. ✅'
        }), 200

    # === 🔒 Validación estándar para los demás ===
    if respuesta_usuario != solucion_correcta:
        cursor.close()
        return jsonify({'error': 'Respuesta incorrecta, inténtalo de nuevo'}), 400

    # Si la respuesta es correcta
    cursor.execute("""
        UPDATE EstadoEjercicioUsuario
        SET estado = 'correcto', repetido = TRUE
        WHERE id_usuario = %s AND id_ejercicio = %s
    """, (id_usuario, id_ejercicio))
    mysql.connection.commit()

    # Intentamos desbloquear el siguiente
    cursor.execute("""
        SELECT id_modulo, orden FROM Ejercicio WHERE id_ejercicio = %s
    """, (id_ejercicio,))
    datos = cursor.fetchone()

    if datos:
        id_modulo, orden_actual = datos
        cursor.execute("""
            SELECT id_ejercicio FROM Ejercicio
            WHERE id_modulo = %s AND orden = %s
        """, (id_modulo, orden_actual + 1))
        siguiente = cursor.fetchone()

        if siguiente:
            cursor.execute("""
                UPDATE EstadoEjercicioUsuario
                SET estado = 'incompleto'
                WHERE id_usuario = %s AND id_ejercicio = %s
            """, (id_usuario, siguiente[0]))
            mysql.connection.commit()

    cursor.close()

    return jsonify({'mensaje': '¡Respuesta correcta! Ejercicio superado.'}), 200




# ============================
# Configurar y ejecutar la app
# ============================
if __name__ == "__main__":
    app.run(debug=True)
