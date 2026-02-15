const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'gymdb',
  port: process.env.DB_PORT || 5432,
});

pool
  .connect()
  .then(() => console.log('Base de datos conectada correctamente'))
  .catch(err => console.error('Error al conectar con la base de datos:', err));

module.exports = pool;
