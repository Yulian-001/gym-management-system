const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1447',
  database: process.env.DB_NAME || 'gym_db',
  port: process.env.DB_PORT || 5432,
});

pool
  .connect()
  .then(() => console.log('Base de datos conectada correctamente'))
  .catch(err => console.error('Error al conectar con la base de datos:', err));

module.exports = pool;
