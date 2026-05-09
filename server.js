const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// SERVIR ARCHIVOS HTML/CSS/JS
app.use(express.static('public'));
// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'p2web'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// --- RUTA PARA REGISTRAR UN NUEVO USUARIO ---
app.post('/api/register', (req, res) => {
    const { Nombre, Correo, Contrasena } = req.body;

    // Importante: Verifica que en tu DB la columna sea 'Contraseña' o 'Contrasena'
    // Aquí usamos 'Contraseña' para que coincida con tu esquema de login
    const query = 'INSERT INTO usuarios (Nombre, Correo, Contrasena) VALUES (?, ?, ?)';

    db.query(query, [Nombre, Correo, Contrasena], (err, result) => {
        if (err) {
            console.error("Error al insertar:", err);
            return res.status(500).json({ message: "Error al registrar usuario" });
        }
        res.status(201).json({
            message: "Usuario registrado con éxito",
            id: result.insertId
        });
    });
});

// --- RUTA PARA VALIDAR EL INICIO DE SESIÓN ---
app.post('/api/login', (req, res) => {
    const { Nombre, Correo, Contrasena } = req.body;

    // Consulta para verificar si los datos coinciden
    const query = 'SELECT * FROM usuarios WHERE Nombre = ? AND Correo = ? AND Contrasena = ?';

    db.query(query, [Nombre, Correo, Contrasena], (err, results) => {
        if (err) {
            console.error("Error en el login:", err);
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (results.length > 0) {
            res.status(200).json({
                message: "Usuario encontrado",
                user: results[0]
            });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas" });
        }
    });
});
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Iniciar servidor
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});