const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

//* === Importar base de datos ===
const db = require('./src/config/db');

app.use(cors());
app.use(express.json());

//* === Configuracion de rutas ===
app.get('/', (req, res) => {
  res.json({
    message: 'Api del Gym funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

//* === Ruta de prueba de conexion DB ===
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
//* === Fin ruta de prueba ===

const plansRoutes = require('./src/modules/plans/plans.routes');
app.use('/Api/plans', plansRoutes);

const clientsRoutes = require('./src/modules/clients/clients.routes');
app.use('/Api/clients', clientsRoutes);

const salesRoutes = require('./src/modules/sales/sales.routes');
app.use('/Api/sales', salesRoutes);

const entradaDiaRoutes = require('./src/modules/entradaDia/entradaDia.routes');
app.use('/Api/entrada-dia', entradaDiaRoutes);

const estadoRoutes = require('./src/modules/estado/estado.routes');
app.use('/Api/estado', estadoRoutes);

const contabilidadRoutes = require('./src/modules/contabilidad/contabilidad.routes');
app.use('/Api/contabilidad', contabilidadRoutes);

//? Asistencia - registro de entradas de clientes
const asistenciaRoutes = require('./src/modules/asistencia/asistencia.routes');
app.use('/Api/asistencia', asistenciaRoutes);

//? Empleados - login y gestion de empleados
const empleadosRoutes = require('./src/modules/empleados/empleados.routes');
app.use('/Api/empleados', empleadosRoutes);


//* === Manejador de rutas inexistentes - debe quedar al final ===
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

//* === Inicio del servidor ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
