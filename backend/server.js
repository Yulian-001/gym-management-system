const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// IMPORTAR BASE DE DATOS
const db = require('./src/config/db');

app.use(cors());
app.use(express.json());

// ======= LAS RUTAS VAN AQUÍ =======
app.get('/', (req, res) => {
  res.json({
    message: 'Api del Gym funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ------- AÑADIR AQUÍ EL TEST --------
app.get('/Api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      connected: true,
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.json({
      connected: false,
      error: error.message
    });
  }
});
// ----------- FIN TEST ---------------

const plansRoutes = require('./src/modules/plans/plans.routes');
app.use('/Api/plans', plansRoutes);

const attendanceRoutes = require('./src/modules/attendance/attendance.routes');
app.use('/Api/attendance', attendanceRoutes);

const clientsRoutes = require('./src/modules/clients/clients.routes');
app.use('/Api/clients', clientsRoutes);

const authRoutes = require('./src/modules/auth/auth.routes');
app.use('/Api/auth', authRoutes);

const reportsRoutes = require('./src/modules/reports/reports.routes');
app.use('/Api/reports', reportsRoutes);

const exportsRoutes = require('./src/modules/exports/exports.routes');
app.use('/Api/exports', exportsRoutes);

// ❌ Esto DEBE quedar al final: manejador de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});


