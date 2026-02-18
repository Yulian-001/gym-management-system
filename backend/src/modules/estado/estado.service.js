const pool = require('../../config/db');

// Obtener todos los clientes congelados con información del plan
const getClientesCongelados = async () => {
  const result = await pool.query(`
    SELECT 
      cc.id as congelado_id,
      cc.cliente_id,
      c.nombre,
      c.cedula,
      c.plan_id,
      p.name as plan_nombre,
      c.inicio as fecha_inicio_plan,
      c.vence as fecha_vencimiento_plan,
      cc.fecha_congelacion,
      cc.fecha_descongelacion,
      cc.estado,
      EXTRACT(DAY FROM AGE(COALESCE(cc.fecha_descongelacion, CURRENT_DATE), cc.fecha_congelacion))::INTEGER as dias_congelado,
      EXTRACT(DAY FROM AGE(c.vence, c.inicio))::INTEGER as dias_totales_plan,
      EXTRACT(DAY FROM AGE(c.vence, CURRENT_DATE))::INTEGER as dias_restantes_plan
    FROM cliente_congelados cc
    JOIN clientes c ON cc.cliente_id = c.id
    JOIN plans p ON c.plan_id = p.id
    WHERE cc.estado = 'congelado'
    ORDER BY cc.fecha_congelacion DESC
  `);
  return result.rows;
};

// Obtener clientes descongelados (histórico)
const getClientesDescongelados = async () => {
  const result = await pool.query(`
    SELECT 
      cc.id as congelado_id,
      cc.cliente_id,
      c.nombre,
      c.cedula,
      c.plan_id,
      p.name as plan_nombre,
      c.inicio as fecha_inicio_plan,
      c.vence as fecha_vencimiento_plan,
      cc.fecha_congelacion,
      cc.fecha_descongelacion,
      cc.estado,
      EXTRACT(DAY FROM AGE(cc.fecha_descongelacion, cc.fecha_congelacion))::INTEGER as dias_congelado,
      EXTRACT(DAY FROM AGE(c.vence, c.inicio))::INTEGER as dias_totales_plan,
      EXTRACT(DAY FROM AGE(c.vence, CURRENT_DATE))::INTEGER as dias_restantes_plan
    FROM cliente_congelados cc
    JOIN clientes c ON cc.cliente_id = c.id
    JOIN plans p ON c.plan_id = p.id
    WHERE cc.estado = 'descongelado'
    ORDER BY cc.fecha_descongelacion DESC
  `);
  return result.rows;
};

// Obtener total de clientes congelados
const getTotalClientesCongelados = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) as total FROM cliente_congelados WHERE estado = 'congelado'
  `);
  return result.rows[0].total;
};

// Buscar cliente por nombre o cédula y verificar si está congelado
const buscarCliente = async (busqueda) => {
  const result = await pool.query(`
    SELECT DISTINCT
      c.id,
      c.nombre,
      c.cedula,
      c.plan_id,
      p.name as plan_nombre,
      c.inicio as fecha_inicio_plan,
      c.vence as fecha_vencimiento_plan,
      c.estado as estado_cliente,
      cc.id as congelado_id,
      cc.fecha_congelacion,
      cc.fecha_descongelacion,
      cc.estado as estado_congelamiento,
      EXTRACT(DAY FROM AGE(COALESCE(cc.fecha_descongelacion, CURRENT_DATE), cc.fecha_congelacion))::INTEGER as dias_congelado,
      EXTRACT(DAY FROM AGE(c.vence, c.inicio))::INTEGER as dias_totales_plan,
      EXTRACT(DAY FROM AGE(c.vence, CURRENT_DATE))::INTEGER as dias_restantes_plan
    FROM clientes c
    LEFT JOIN plans p ON c.plan_id = p.id
    LEFT JOIN cliente_congelados cc ON c.id = cc.cliente_id AND cc.estado = 'congelado'
    WHERE LOWER(c.nombre) LIKE LOWER($1) OR c.cedula LIKE $1
    ORDER BY c.nombre
  `, [`%${busqueda}%`]);
  return result.rows;
};

// Congelar cliente
const congelarCliente = async (cliente_id) => {
  const result = await pool.query(`
    INSERT INTO cliente_congelados (cliente_id, fecha_congelacion, estado)
    VALUES ($1, CURRENT_DATE, 'congelado')
    RETURNING *
  `, [cliente_id]);
  return result.rows[0];
};

// Descongelar cliente
const descongelarCliente = async (congelado_id) => {
  const result = await pool.query(`
    UPDATE cliente_congelados 
    SET fecha_descongelacion = CURRENT_DATE, estado = 'descongelado', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [congelado_id]);
  return result.rows[0];
};

module.exports = {
  getClientesCongelados,
  getClientesDescongelados,
  getTotalClientesCongelados,
  buscarCliente,
  congelarCliente,
  descongelarCliente
};
