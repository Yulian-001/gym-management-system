const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('./auth.service');

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // 1️⃣ Validación básica de input
      if (!username || !password) {
        return res.status(400).json({
          error: 'Username y password son obligatorios'
        });
      }

      // 2️⃣ Buscar usuario
      const user = await AuthService.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // 3️⃣ Comparar password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // 4️⃣ Verificar JWT_SECRET ANTES de firmar
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido');
        return res.status(500).json({
          error: 'Configuración del servidor inválida'
        });
      }

      // 5️⃣ Generar token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // 6️⃣ Respuesta exitosa
      res.json({
        message: 'Login exitoso',
        token
      });

    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
