const pool = require('../../config/db');

// === RESUMEN DE CAJA ===

// Obtener resumen de caja del día
const getResumenCajaHoy = async () => {
  const result = await pool.query(`
    SELECT 
      rc.id,
      rc.fecha_resumen,
      rc.total_ventas_efectivo,
      rc.total_ventas_tarjeta,
      rc.total_ventas_transferencia,
      rc.total_egresos_efectivo,
      rc.total_egresos_tarjeta,
      rc.total_egresos_transferencia,
      rc.total_ingresos,
      rc.total_egresos,
      rc.saldo_neto,
      rc.diferencia_caja,
      e1.nombre as abierto_por_nombre,
      e2.nombre as cerrado_por_nombre,
      rc.estado,
      rc.observaciones
    FROM resumen_caja rc
    LEFT JOIN empleados e1 ON rc.abierto_por = e1.id
    LEFT JOIN empleados e2 ON rc.cerrado_por = e2.id
    WHERE rc.fecha_resumen = CURRENT_DATE
    ORDER BY rc.created_at DESC
    LIMIT 1
  `);
  return result.rows[0] || null;
};

// Nota: la funcionalidad de "resumen histórico" se eliminó del frontend,
// por lo que no se exporta ni se usa en el servicio.

// Crear resumen de caja del día
const crearResumenCaja = async (abierto_por) => {
  const result = await pool.query(`
    INSERT INTO resumen_caja (fecha_resumen, abierto_por, estado)
    VALUES (CURRENT_DATE, $1, 'abierto')
    ON CONFLICT (fecha_resumen) DO NOTHING
    RETURNING *
  `, [abierto_por]);
  return result.rows[0];
};

// === VENTAS DEL DÍA ===

// Obtener ventas del día con detalles
const getVentasDelDia = async (fecha = null) => {
  try {
    // Aceptar columnas legacy: 'fecha' y 'total', y usar 'monto' o 'total' según esté disponible.
    const query = `
      SELECT 
        v.id,
        v.cliente_id,
        c.nombre as cliente_nombre,
        c.cedula as cliente_cedula,
        v.plan_id,
        p.name as plan_nombre,
        COALESCE(v.monto, v.total) AS monto,
        v.metodo_pago,
        v.estado,
        COALESCE(v.fecha_venta, v.fecha) AS fecha_venta,
        v.hora_venta AS hora_venta,
        v.empleado_id,
        e.nombre as vendedor_nombre,
        e.cargo
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN plans p ON v.plan_id = p.id
      LEFT JOIN empleados e ON v.empleado_id = e.id
      WHERE DATE(COALESCE(v.fecha_venta, v.fecha)) = $1
      ORDER BY COALESCE(v.fecha_venta, v.fecha) DESC, v.hora_venta DESC
    `;

    const fechaParam = fecha || new Date().toISOString().split('T')[0];
    const result = await pool.query(query, [fechaParam]);
    return result.rows;
  } catch (error) {
    console.error('Error en getVentasDelDia:', error);
    throw error;
  }
};

// Obtener total de ventas del día por método de pago
const getTotalVentasPorMetodo = async (fecha = null) => {
  try {
    const query = `
      SELECT 
        metodo_pago,
        COUNT(*) as cantidad_transacciones,
        SUM(monto) as total_monto
      FROM ventas
      WHERE DATE(fecha_venta) = $1 AND estado IN ('pagado', 'completada')
      GROUP BY metodo_pago
      ORDER BY total_monto DESC
    `;

    const fechaParam = fecha || new Date().toISOString().split('T')[0];
    const result = await pool.query(query, [fechaParam]);
    return result.rows;
  } catch (error) {
    console.error('Error en getTotalVentasPorMetodo:', error);
    throw error;
  }
};

// === EGRESOS ===

// Obtener egresos del día
const getEgresosDelDia = async (fecha = null) => {
  try {
    const query = `
      SELECT 
        id,
        concepto,
        monto,
        categoria,
        fecha_egreso,
        descripcion,
        metodo_pago,
        estado,
        empleado_id,
        e.nombre as autorizado_por_nombre,
        created_at
      FROM egresos eg
      LEFT JOIN empleados e ON eg.autorizado_por = e.id
      WHERE DATE(eg.fecha_egreso) = $1
      ORDER BY eg.created_at DESC
    `;

    const fechaParam = fecha || new Date().toISOString().split('T')[0];
    const result = await pool.query(query, [fechaParam]);
    return result.rows;
  } catch (error) {
    console.error('Error en getEgresosDelDia:', error);
    throw error;
  }
};

// Crear egreso
const crearEgreso = async (concepto, monto, categoria, descripcion, metodo_pago, autorizado_por) => {
  const result = await pool.query(`
    INSERT INTO egresos (concepto, monto, categoria, descripcion, metodo_pago, autorizado_por, estado)
    VALUES ($1, $2, $3, $4, $5, $6, 'completado')
    RETURNING *
  `, [concepto, monto, categoria, descripcion, metodo_pago, autorizado_por]);
  return result.rows[0];
};

// === RESUMEN GENERAL ===

// Calcular resumen del día
const calcularResumenDelDia = async (fecha = null) => {
  try {
    const query = `
      SELECT 
        -- Ventas por método de pago
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'efectivo' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_efectivo,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'tarjeta' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_tarjeta,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'transferencia' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_transferencia,
        -- Egresos por método de pago
        COALESCE(SUM(CASE WHEN eg.metodo_pago = 'efectivo' AND eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos_efectivo,
        COALESCE(SUM(CASE WHEN eg.metodo_pago = 'tarjeta' AND eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos_tarjeta,
        COALESCE(SUM(CASE WHEN eg.metodo_pago = 'transferencia' AND eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos_transferencia,
        -- Totales
        COALESCE(SUM(CASE WHEN v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ingresos,
        COALESCE(SUM(CASE WHEN eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos,
        COUNT(DISTINCT CASE WHEN v.estado IN ('pagado', 'completada') THEN v.id END) as cantidad_ventas,
        COUNT(DISTINCT CASE WHEN eg.estado = 'completado' THEN eg.id END) as cantidad_egresos
      FROM ventas v
      FULL OUTER JOIN egresos eg ON DATE(v.fecha_venta) = DATE(eg.fecha_egreso)
      WHERE DATE(v.fecha_venta) = $1 OR DATE(eg.fecha_egreso) = $1
    `;

    const fechaParam = fecha || new Date().toISOString().split('T')[0];
    const result = await pool.query(query, [fechaParam]);
    return result.rows[0];
  } catch (error) {
    console.error('Error en calcularResumenDelDia:', error);
    throw error;
  }
};

// === EMPLEADOS ===

// Obtener todos los empleados
const getEmpleadosActivos = async () => {
  const result = await pool.query(`
    SELECT id, nombre, cedula, email, telefono, cargo, salario, estado, fecha_contratacion
    FROM empleados
    ORDER BY nombre
  `);
  return result.rows;
};

// Actualizar empleado
const actualizarEmpleado = async (id, nombre, cedula, email, telefono, cargo, salario, estado) => {
  const result = await pool.query(`
    UPDATE empleados
    SET nombre = $2, cedula = $3, email = $4, telefono = $5, cargo = $6, salario = $7, estado = $8
    WHERE id = $1
    RETURNING *
  `, [id, nombre, cedula, email, telefono, cargo, salario, estado]);
  return result.rows[0];
};

// Eliminar empleado
const eliminarEmpleado = async (id) => {
  const result = await pool.query(`
    DELETE FROM empleados WHERE id = $1 RETURNING *
  `, [id]);
  return result.rows[0];
};

// Crear empleado
const crearEmpleado = async (nombre, cedula, email, telefono, cargo, salario, estado = 'activo') => {
  const result = await pool.query(`
    INSERT INTO empleados (nombre, cedula, email, telefono, cargo, salario, estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `, [nombre, cedula, email, telefono, cargo, salario, estado]);
  return result.rows[0];
};

// === CIERRE DE CAJA ===

// Obtener resumen completo para cierre de caja del día
const obtenerResumenCierreCaja = async (fecha = null) => {
  try {
    const fechaParam = fecha || new Date().toISOString().split('T')[0];

    // Obtener resumen general
    const resumenQuery = `
      SELECT 
        -- Ventas por método de pago
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'efectivo' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_efectivo,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'tarjeta' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_tarjeta,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'transferencia' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_transferencia,
        -- Egresos por método de pago
        COALESCE(SUM(CASE WHEN eg.metodo_pago = 'efectivo' AND eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos_efectivo,
        COALESCE(SUM(CASE WHEN eg.metodo_pago = 'tarjeta' AND eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos_tarjeta,
        COALESCE(SUM(CASE WHEN eg.metodo_pago = 'transferencia' AND eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos_transferencia,
        -- Totales
        COALESCE(SUM(CASE WHEN v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ingresos,
        COALESCE(SUM(CASE WHEN eg.estado = 'completado' THEN eg.monto ELSE 0 END), 0) as total_egresos,
        COUNT(DISTINCT CASE WHEN v.estado IN ('pagado', 'completada') THEN v.id END) as cantidad_ventas,
        COUNT(DISTINCT CASE WHEN eg.estado = 'completado' THEN eg.id END) as cantidad_egresos
      FROM ventas v
      FULL OUTER JOIN egresos eg ON DATE(v.fecha_venta) = DATE(eg.fecha_egreso)
      WHERE DATE(v.fecha_venta) = $1 OR DATE(eg.fecha_egreso) = $1
    `;
    
    const resumenResult = await pool.query(resumenQuery, [fechaParam]);
    const resumen = resumenResult.rows[0];

    // Obtener detalles de ventas por vendedor
    const ventasVendedorQuery = `
      SELECT 
        e.id as empleado_id,
        e.nombre as vendedor,
        e.cargo,
        COUNT(v.id) as cantidad_ventas,
        SUM(v.monto) as total_vendido
      FROM ventas v
      LEFT JOIN empleados e ON v.empleado_id = e.id
      WHERE DATE(v.fecha_venta) = $1 AND v.estado IN ('pagado', 'completada')
      GROUP BY e.id, e.nombre, e.cargo
      ORDER BY total_vendido DESC
    `;
    
    const ventasVendedorResult = await pool.query(ventasVendedorQuery, [fechaParam]);
    const ventasPorVendedor = ventasVendedorResult.rows;

    // Obtener detalles de planes vendidos
    const planesQuery = `
      SELECT 
        p.id,
        p.name as plan_nombre,
        p.price as precio,
        COUNT(v.id) as cantidad_vendida,
        SUM(v.monto) as total_generado
      FROM ventas v
      LEFT JOIN plans p ON v.plan_id = p.id
      WHERE DATE(v.fecha_venta) = $1 AND v.estado IN ('pagado', 'completada') AND v.plan_id IS NOT NULL
      GROUP BY p.id, p.name, p.price
      ORDER BY cantidad_vendida DESC
    `;
    
    const planesResult = await pool.query(planesQuery, [fechaParam]);
    const planesSinPlan = await pool.query(`
      SELECT 
        COUNT(v.id) as cantidad,
        SUM(v.monto) as total
      FROM ventas v
      WHERE DATE(v.fecha_venta) = $1 AND v.estado IN ('pagado', 'completada') AND v.plan_id IS NULL
    `, [fechaParam]);
    
    const planesSinPlanData = planesSinPlan.rows[0];
    const planes = planesResult.rows;
    // Nota: no incluimos aquí una fila sintética 'Sin Plan (Producto)'.
    // Las ventas sin plan quedan fuera del listado de "Planes Vendidos"
    // para evitar mezclar ventas de productos con tipos de plan.

    // Obtener egresos por categoría
    const egresosQuery = `
      SELECT 
        categoria,
        COUNT(id) as cantidad,
        SUM(monto) as total
      FROM egresos
      WHERE DATE(fecha_egreso) = $1 AND estado = 'completado'
      GROUP BY categoria
      ORDER BY total DESC
    `;
    
    const egresosResult = await pool.query(egresosQuery, [fechaParam]);
    const egresosPorCategoria = egresosResult.rows;

    return {
      fecha: fechaParam,
      resumen: {
        ...resumen,
        saldo_neto: parseFloat(resumen.total_ingresos) - parseFloat(resumen.total_egresos)
      },
      ventasPorVendedor,
      planes,
      egresosPorCategoria
    };
  } catch (error) {
    console.error('Error en obtenerResumenCierreCaja:', error);
    throw error;
  }
};

// Registrar cierre de caja (guardar en BD)
const crearCierreCaja = async (empleado_id, observaciones = null) => {
  try {
    const fechaParam = new Date().toISOString().split('T')[0];
    
    // Obtener resumen del día
    const resumen = await obtenerResumenCierreCaja(fechaParam);

    // Insertar en resumen_caja
    const query = `
      INSERT INTO resumen_caja (
        fecha_resumen,
        total_ventas_efectivo,
        total_ventas_tarjeta,
        total_ventas_transferencia,
        total_egresos_efectivo,
        total_egresos_tarjeta,
        total_egresos_transferencia,
        total_ingresos,
        total_egresos,
        saldo_neto,
        diferencia_caja,
        cerrado_por,
        estado,
        observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'cerrado', $13)
      ON CONFLICT (fecha_resumen) DO UPDATE SET
        cerrado_por = $12,
        estado = 'cerrado',
        observaciones = $13
      RETURNING *
    `;

    const saldoNeto = parseFloat(resumen.resumen.total_ingresos) - parseFloat(resumen.resumen.total_egresos);
    
    const result = await pool.query(query, [
      fechaParam,
      resumen.resumen.total_ventas_efectivo,
      resumen.resumen.total_ventas_tarjeta,
      resumen.resumen.total_ventas_transferencia,
      resumen.resumen.total_egresos_efectivo,
      resumen.resumen.total_egresos_tarjeta,
      resumen.resumen.total_egresos_transferencia,
      resumen.resumen.total_ingresos,
      resumen.resumen.total_egresos,
      saldoNeto,
      0, // diferencia_caja será calculado manualmente si es necesario
      empleado_id,
      observaciones
    ]);

    return {
      cierreCaja: result.rows[0],
      resumen: resumen
    };
  } catch (error) {
    console.error('Error en crearCierreCaja:', error);
    throw error;
  }
};

module.exports = {
  getResumenCajaHoy,
  crearResumenCaja,
  getVentasDelDia,
  getTotalVentasPorMetodo,
  getEgresosDelDia,
  crearEgreso,
  calcularResumenDelDia,
  getEmpleadosActivos,
  crearEmpleado,
  obtenerResumenCierreCaja,
  crearCierreCaja
};
