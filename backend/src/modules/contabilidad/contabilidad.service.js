const pool = require('../../config/db');

//? === RESUMEN DE CAJA ===

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


//? Crear resumen de caja del día (apertura)
const crearResumenCaja = async (abierto_por) => {
  // Verificar si ya existe una apertura hoy para este empleado
  const existing = await pool.query(
    `SELECT id FROM resumen_caja WHERE fecha_resumen = CURRENT_DATE AND abierto_por = $1 AND estado = 'abierto' LIMIT 1`,
    [abierto_por]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const result = await pool.query(`
    INSERT INTO resumen_caja (fecha_resumen, abierto_por, estado)
    VALUES (CURRENT_DATE, $1, 'abierto')
    RETURNING *
  `, [abierto_por]);
  return result.rows[0];
};

//? === VENTAS DEL DÍA ===

// Obtener todas las ventas del día (filtradas por fecha)
const getVentasDelDia = async (fecha = null) => {
  try {
    const fechaFinal = fecha || new Date().toISOString().split('T')[0];
    const result = await pool.query(`
      SELECT * FROM ventas 
      WHERE estado IN ('completada', 'pagado')
      AND (DATE(fecha_venta) = $1 OR DATE(fecha) = $1)
      ORDER BY id ASC
    `, [fechaFinal]);
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

//? === EGRESOS ===

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

//? Crear egreso
const crearEgreso = async (concepto, monto, categoria, descripcion, metodo_pago, autorizado_por) => {
  const result = await pool.query(`
    INSERT INTO egresos (concepto, monto, categoria, descripcion, metodo_pago, autorizado_por, estado)
    VALUES ($1, $2, $3, $4, $5, $6, 'completado')
    RETURNING *
  `, [concepto, monto, categoria, descripcion, metodo_pago, autorizado_por]);
  return result.rows[0];
};

//? === RESUMEN GENERAL ===

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

//? === EMPLEADOS ===

// Obtener todos los empleados
const getEmpleadosActivos = async () => {
  const result = await pool.query(`
    SELECT id, nombre, cedula, email, telefono, cargo, salario, estado, fecha_contratacion
    FROM empleados
    ORDER BY nombre
  `);
  return result.rows;
};

//? Actualizar empleado
const actualizarEmpleado = async (id, nombre, cedula, email, telefono, cargo, salario, estado) => {
  const result = await pool.query(`
    UPDATE empleados
    SET nombre = $2, cedula = $3, email = $4, telefono = $5, cargo = $6, salario = $7, estado = $8
    WHERE id = $1
    RETURNING *
  `, [id, nombre, cedula, email, telefono, cargo, salario, estado]);
  return result.rows[0];
};

//? Eliminar empleado
const eliminarEmpleado = async (id) => {
  const result = await pool.query(`
    DELETE FROM empleados WHERE id = $1 RETURNING *
  `, [id]);
  return result.rows[0];
};

//? Crear empleado
const crearEmpleado = async (nombre, cedula, email, telefono, cargo, salario, estado = 'activo') => {
  // Mapear cargo a rol
  const cargoToRol = {
    'Recepcionista': 'recepcionista',
    'Gerente': 'gerente',
    'Administrador': 'administrador',
    'Vendedor': 'vendedor',
    'Otro': 'empleado'
  };
  
  const rol = cargoToRol[cargo] || 'empleado';
  
  // La contraseña por defecto es la cédula
  const password = cedula;
  
  const result = await pool.query(`
    INSERT INTO empleados (nombre, cedula, email, telefono, cargo, salario, password, rol, estado, respuesta_1, respuesta_2, respuesta_3)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, NULL, NULL)
    RETURNING id, nombre, cedula, email, telefono, cargo, salario, password, rol, estado, created_at, respuesta_1
  `, [nombre, cedula, email, telefono, cargo, salario, password, rol, estado]);
  
  const empleado = result.rows[0];
  
  // Retornar información para el frontend con flag de preguntas de seguridad
  return {
    id: empleado.id,
    nombre: empleado.nombre,
    cedula: empleado.cedula,
    email: empleado.email,
    telefono: empleado.telefono,
    cargo: empleado.cargo,
    salario: empleado.salario,
    rol: empleado.rol,
    estado: empleado.estado,
    requiresSecurityQuestions: true  // Siempre true para módulos que requieren preguntas
  };
};

//? === CIERRE DE CAJA ===

// Obtener resumen completo para cierre de caja del día (filtrado por empleado)
const obtenerResumenCierreCaja = async (fecha = null, empleado_id = null) => {
  try {
    const fechaParam = fecha || new Date().toISOString().split('T')[0];

    // Construir filtro de empleado si se especifica
    const empFilter = empleado_id ? `AND v.empleado_id = ${parseInt(empleado_id)}` : '';

    // Obtener resumen filtrado por empleado
    const resumenQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'efectivo' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_efectivo,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'tarjeta' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_tarjeta,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'transferencia' AND v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ventas_transferencia,
        COALESCE(0, 0) as total_egresos_efectivo,
        COALESCE(0, 0) as total_egresos_tarjeta,
        COALESCE(0, 0) as total_egresos_transferencia,
        COALESCE(SUM(CASE WHEN v.estado IN ('pagado', 'completada') THEN v.monto ELSE 0 END), 0) as total_ingresos,
        COALESCE(0, 0) as total_egresos,
        COUNT(DISTINCT CASE WHEN v.estado IN ('pagado', 'completada') THEN v.id END) as cantidad_ventas,
        0 as cantidad_egresos
      FROM ventas v
      WHERE DATE(v.fecha_venta) = $1 ${empFilter}
    `;
    
    const resumenResult = await pool.query(resumenQuery, [fechaParam]);
    const resumen = resumenResult.rows[0];

    //? Obtener detalles de ventas por vendedor (filtrado por empleado si aplica)
    const ventasVendedorQuery = `
      SELECT 
        e.id as empleado_id,
        e.nombre as vendedor,
        e.cargo,
        COUNT(v.id) as cantidad_ventas,
        SUM(v.monto) as total_vendido
      FROM ventas v
      LEFT JOIN empleados e ON v.empleado_id = e.id
      WHERE DATE(v.fecha_venta) = $1 AND v.estado IN ('pagado', 'completada') ${empFilter}
      GROUP BY e.id, e.nombre, e.cargo
      ORDER BY total_vendido DESC
    `;
    
    const ventasVendedorResult = await pool.query(ventasVendedorQuery, [fechaParam]);
    const ventasPorVendedor = ventasVendedorResult.rows;

    // Obtener detalles de planes vendidos (filtrado por empleado si aplica)
    const planesQuery = `
      SELECT 
        p.id,
        p.name as plan_nombre,
        p.price as precio,
        COUNT(v.id) as cantidad_vendida,
        SUM(v.monto) as total_generado
      FROM ventas v
      LEFT JOIN plans p ON v.plan_id = p.id
      WHERE DATE(v.fecha_venta) = $1 AND v.estado IN ('pagado', 'completada') AND v.plan_id IS NOT NULL ${empFilter}
      GROUP BY p.id, p.name, p.price
      ORDER BY cantidad_vendida DESC
    `;
    
    const planesResult = await pool.query(planesQuery, [fechaParam]);
    const planesSinPlan = await pool.query(`
      SELECT 
        COUNT(v.id) as cantidad,
        SUM(v.monto) as total
      FROM ventas v
      WHERE DATE(v.fecha_venta) = $1 AND v.estado IN ('pagado', 'completada') AND v.plan_id IS NULL ${empFilter}
    `, [fechaParam]);
    
    const planesSinPlanData = planesSinPlan.rows[0];
    const planes = planesResult.rows;

    //? NOTA: no incluimos aqui una fila sintetica Sin-Plan (Producto)
    //? Las ventas sin plan quedan fuera del listado de Planes Vendidos
    //? para evitar mezclar ventas de productos con tipos de plan.

    //? Obtener egresos por categoría
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

//? Registrar cierre de caja (guardar en BD)
const crearCierreCaja = async (empleado_id, observaciones = null) => {
  try {
    const fechaParam = new Date().toISOString().split('T')[0];
    
    //? Obtener resumen filtrado por el empleado que cierra
    const resumen = await obtenerResumenCierreCaja(fechaParam, empleado_id);

    //? Insertar en resumen_caja
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
      ON CONFLICT (fecha_resumen, cerrado_por) DO UPDATE SET
        total_ventas_efectivo = EXCLUDED.total_ventas_efectivo,
        total_ventas_tarjeta = EXCLUDED.total_ventas_tarjeta,
        total_ventas_transferencia = EXCLUDED.total_ventas_transferencia,
        total_ingresos = EXCLUDED.total_ingresos,
        saldo_neto = EXCLUDED.saldo_neto,
        estado = 'cerrado',
        observaciones = EXCLUDED.observaciones
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
      0,
      empleado_id,
      observaciones
    ]);

// Archivar TODAS las ventas activas del empleado que hace el cierre
    const updateVentasQuery = `
      UPDATE ventas 
      SET estado = 'archivada'
      WHERE estado NOT IN ('archivada') AND empleado_id = $1
    `;
    await pool.query(updateVentasQuery, [empleado_id]);

    // Archivar también las entradas de día del empleado que hace el cierre
    const updateEntradasQuery = `
      UPDATE entrada_dia 
      SET estado = 'archivada'
      WHERE empleado_id = $1 AND estado NOT IN ('archivada', 'cancelada')
    `;
    await pool.query(updateEntradasQuery, [empleado_id]);

    return {
      cierreCaja: result.rows[0],
      resumen: resumen,
      ventasArchivadas: true
    };
  } catch (error) {
    console.error('Error en crearCierreCaja:', error);
    throw error;
  }
};

//? === HISTORIAL DE CIERRES DE CAJA (Reportes) ===

const getVentasArchivadas = async (fechaInicio = null, fechaFin = null) => {
  try {
    let query = `
      SELECT 
        v.id,
        v.cliente_id,
        c.nombre as cliente_nombre,
        v.plan_id,
        p.name as plan_nombre,
        v.descripcion,
        v.cantidad,
        v.precio_unitario,
        COALESCE(v.monto, v.total) AS monto,
        v.metodo_pago,
        v.estado,
        COALESCE(v.fecha_venta, v.fecha) AS fecha_venta,
        v.hora_venta AS hora_venta,
        v.empleado_id,
        e.nombre as vendedor_nombre,
        rc.fecha_resumen as fecha_cierre
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN plans p ON v.plan_id = p.id
      LEFT JOIN empleados e ON v.empleado_id = e.id
      LEFT JOIN resumen_caja rc ON DATE(rc.fecha_resumen) = DATE(COALESCE(v.fecha_venta, v.fecha))
      WHERE v.estado = 'archivada'
    `;

    const params = [];
    if (fechaInicio) {
      params.push(fechaInicio);
      query += ` AND DATE(COALESCE(v.fecha_venta, v.fecha)) >= $${params.length}`;
    }
    if (fechaFin) {
      params.push(fechaFin);
      query += ` AND DATE(COALESCE(v.fecha_venta, v.fecha)) <= $${params.length}`;
    }

    query += ` ORDER BY COALESCE(v.fecha_venta, v.fecha) DESC, v.hora_venta DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error en getVentasArchivadas:', error);
    throw error;
  }
};

// Obtener resumen de cierres de caja (solo los cerrados)
const getCierresCajaHistorico = async (fechaInicio = null, fechaFin = null) => {
  try {
    let query = `
      SELECT 
        rc.*,
        e.nombre as cerrado_por_nombre,
        COUNT(v.id) as cantidad_ventas,
        SUM(v.monto) as total_ventas_cierre
      FROM resumen_caja rc
      LEFT JOIN empleados e ON rc.cerrado_por = e.id
      LEFT JOIN ventas v ON DATE(v.fecha_venta) = rc.fecha_resumen AND v.estado = 'archivada' AND v.empleado_id = rc.cerrado_por
      WHERE rc.estado = 'cerrado'
    `;

    const params = [];
    if (fechaInicio) {
      params.push(fechaInicio);
      query += ` AND rc.fecha_resumen >= $${params.length}`;
    }
    if (fechaFin) {
      params.push(fechaFin);
      query += ` AND rc.fecha_resumen <= $${params.length}`;
    }

    query += ` GROUP BY rc.id, e.nombre ORDER BY rc.fecha_resumen DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error en getCierresCajaHistorico:', error);
    throw error;
  }
};

module.exports = {
  getResumenCajaHoy,
  crearResumenCaja,
  getVentasDelDia,
  getTotalVentasPorMetodo,
  getEgresosDelDia,
  getVentasArchivadas,
  getCierresCajaHistorico,
  crearEgreso,
  calcularResumenDelDia,
  getEmpleadosActivos,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerResumenCierreCaja,
  crearCierreCaja
};
