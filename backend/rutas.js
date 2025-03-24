const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./bd');

const SECRETO_JWT = 'tu_secreto_super_seguro';

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);
    db.query(
      'INSERT INTO clientes (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, correo, contrasenaEncriptada],
      (err, resultado) => {
        if (err) {
          console.error("Error en la base de datos:", err);
          return res.status(500).json({ error: 'Error al registrar usuario' });
        }
        const token = jwt.sign({ id: resultado.insertId, correo }, SECRETO_JWT, { expiresIn: '1h' });
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicio de sesión
router.post('/inicio-sesion', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    db.query('SELECT * FROM clientes WHERE email = ?', [correo], async (err, filas) => {
      if (err || filas.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      const usuario = filas[0];
      const contrasenaValida = await bcrypt.compare(contrasena, usuario.password);
      if (!contrasenaValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      const token = jwt.sign({ id: usuario.id, correo: usuario.email }, SECRETO_JWT, { expiresIn: '1h' });
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Registrar mascota
router.post('/registrar-mascota', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener token
    if (!token) return res.status(401).json({ error: "Token no proporcionado" });
  
    try {
      const decoded = jwt.verify(token, SECRETO_JWT); // Verificar token
      const { especie, raza, nombre, edad } = req.body;
  
      // Insertar con id_cliente
      db.query(
        'INSERT INTO mascotas (especie, raza, nombre, edad, id_cliente) VALUES (?, ?, ?, ?, ?)',
        [especie, raza, nombre, edad, decoded.id], // Añadir decoded.id
        (err, resultado) => {
          if (err) {
            console.error("Error en BD:", err);
            return res.status(500).json({ error: 'Error al registrar mascota' });
          }
          res.status(201).json({ message: 'Mascota registrada' });
        }
      );
    } catch (error) {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  });

// Obtener mascotas con datos de salud
router.get('/mis-mascotas', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  try {
    const decoded = jwt.verify(token, SECRETO_JWT);
    const sql = `
      SELECT m.*, s.ultimo_dia_desparasitacion, s.nuevo_dia_desparasitar,
             s.ultimo_dia_vacunacion, s.nuevo_dia_vacunacion
      FROM mascotas m
      LEFT JOIN salud_mascotas s ON m.id = s.id_mascota
      WHERE m.id_cliente = ?
    `;
    db.query(sql, [decoded.id], (err, resultados) => {
      if (err) return res.status(500).json({ error: 'Error en consulta' });
      res.json(resultados);
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Agendar cita (versión actualizada)
router.post('/agendar-cita', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { tipo, fecha, vacunasExistentes, vacunasFaltantes, fechaDesparasitacionAnterior } = req.body;
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, SECRETO_JWT);
    const sql = `
      INSERT INTO citas 
      (fecha_hora, motivo, vacunas_existentes, vacunas_faltantes, fecha_anterior_desparasitacion, id_cliente)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        fecha,
        tipo,
        vacunasExistentes || null,
        vacunasFaltantes || null,
        fechaDesparasitacionAnterior || null,
        decoded.id
      ],
      (err, resultado) => {
        if (err) {
          console.error("Error en BD:", err);
          return res.status(500).json({ error: 'Error al agendar cita' });
        }
        res.json({ message: 'Cita registrada exitosamente' });
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Ruta raíz
router.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

module.exports = router;