const contabilidadService = require('./contabilidad.service');

//? === RESUMEN DE CAJA ===

const getResumenCajaHoy = async (req, res) => {
  try {
    const resumen = await contabilidadService.getResumenCajaHoy();
    res.status(200).json({
      success: true,
      data: resumen
    });
  } catch (error) {
    console.error('Error al obtener resumen de caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen de caja',
      error: error.message
    });
  }
};



const crearResumenCaja = async (req, res) => {
  try {
    const { abierto_por } = req.body;

    if (!abierto_por) {
      return res.status(400).json({
        success: false,
        message: 'Error: abierto_por requerido'
      });
    }

    const nuevoResumen = await contabilidadService.crearResumenCaja(abierto_por);
    res.status(201).json({
      success: true,
      message: 'Resumen de caja creado exitosamente',
      data: nuevoResumen
    });
  } catch (error) {
    console.error('Error al crear resumen de caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear resumen de caja',
      error: error.message
    });
  }
};

//? === VENTAS DEL DÍA ===

const getVentasDelDia = async (req, res) => {
  try {
    const { fecha } = req.query;
    const ventas = await contabilidadService.getVentasDelDia(fecha);
    
    //? Traer detalles de clientes para enriquecer los datos
    const pool = require('../../config/db');
    const ventasConDetalles = await Promise.all(
      ventas.map(async (venta) => {
        let clienteNombre = 'Sin cliente';
        if (venta.cliente_id) {
          try {
            const clienteResult = await pool.query('SELECT nombre FROM clientes WHERE id = $1', [venta.cliente_id]);
            if (clienteResult.rows.length > 0) {
              clienteNombre = clienteResult.rows[0].nombre;
            }
          } catch (e) {
            console.warn('Error fetching cliente details:', e);
          }
        }
        return { ...venta, cliente_nombre: clienteNombre };
      })
    );
    
    res.status(200).json({
      success: true,
      data: ventasConDetalles,
      total: ventasConDetalles.length
    });
  } catch (error) {
    console.error('Error al obtener ventas del día:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas del día',
      error: error.message
    });
  }
};

const getTotalVentasPorMetodo = async (req, res) => {
  try {
    const { fecha } = req.query;
    const totales = await contabilidadService.getTotalVentasPorMetodo(fecha);
    res.status(200).json({
      success: true,
      data: totales
    });
  } catch (error) {
    console.error('Error al obtener totales de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener totales de ventas',
      error: error.message
    });
  }
};

//? === EGRESOS ===

const getEgresosDelDia = async (req, res) => {
  try {
    const { fecha } = req.query;
    const egresos = await contabilidadService.getEgresosDelDia(fecha);
    res.status(200).json({
      success: true,
      data: egresos,
      total: egresos.length
    });
  } catch (error) {
    console.error('Error al obtener egresos del día:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener egresos del día',
      error: error.message
    });
  }
};

const crearEgreso = async (req, res) => {
  try {
    const { concepto, monto, categoria, descripcion, metodo_pago, autorizado_por } = req.body;

    //? Validar campos requeridos del egreso
    if (!concepto || !monto || !categoria || !metodo_pago || !autorizado_por) {
      return res.status(400).json({
        success: false,
        message: 'Error: concepto, monto, categoria, metodo_pago y autorizado_por son requeridos'
      });
    }

    if (monto <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a 0'
      });
    }

    const nuevoEgreso = await contabilidadService.crearEgreso(
      concepto,
      monto,
      categoria,
      descripcion,
      metodo_pago,
      autorizado_por
    );

    res.status(201).json({
      success: true,
      message: 'Egreso creado exitosamente',
      data: nuevoEgreso
    });
  } catch (error) {
    console.error('Error al crear egreso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear egreso',
      error: error.message
    });
  }
};

//? === RESUMEN GENERAL ===

const calcularResumenDelDia = async (req, res) => {
  try {
    const { fecha } = req.query;
    const resumen = await contabilidadService.calcularResumenDelDia(fecha);
    
    if (resumen) {
      const totalVentas = parseFloat(resumen.total_ingresos);
      const totalEgresos = parseFloat(resumen.total_egresos);
      const saldoNeto = totalVentas - totalEgresos;

      res.status(200).json({
        success: true,
        data: {
          ...resumen,
          saldo_neto: saldoNeto
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No hay datos para el día solicitado'
      });
    }
  } catch (error) {
    console.error('Error al calcular resumen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular resumen',
      error: error.message
    });
  }
};

//? === EMPLEADOS ===

const getEmpleadosActivos = async (req, res) => {
  try {
    const empleados = await contabilidadService.getEmpleadosActivos();
    res.status(200).json({
      success: true,
      data: empleados
    });
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleados',
      error: error.message
    });
  }
};

const crearEmpleado = async (req, res) => {
  try {
    const { nombre, cedula, email, telefono, cargo, salario, estado } = req.body;

    //? Validaciones de campos del empleado
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio'
      });
    }

    if (!cedula || !cedula.trim()) {
      return res.status(400).json({
        success: false,
        message: 'La cédula es obligatoria'
      });
    }

    if (!cargo || !cargo.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El cargo es obligatorio'
      });
    }

    if (salario && salario < 0) {
      return res.status(400).json({
        success: false,
        message: 'El salario no puede ser negativo'
      });
    }

    const nuevoEmpleado = await contabilidadService.crearEmpleado(
      nombre.trim(),
      cedula.trim(),
      email || null,
      telefono || null,
      cargo.trim(),
      salario || null,
      estado || 'activo'
    );

    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: nuevoEmpleado
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    
    //? Manejar error de cedula duplicada
    if (error.message && error.message.includes('cedula')) {
      return res.status(400).json({
        success: false,
        message: 'La cédula ya está registrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear empleado',
      error: error.message
    });
  }
};

const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cedula, email, telefono, cargo, salario, estado } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Id requerido' });
    }
    const updated = await contabilidadService.actualizarEmpleado(id, nombre, cedula, email, telefono, cargo, salario, estado);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar empleado', error: error.message });
  }
};

const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Id requerido' });
    }
    const deleted = await contabilidadService.eliminarEmpleado(id);
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar empleado', error: error.message });
  }
};

//? === CIERRE DE CAJA ===

const obtenerResumenCierreCaja = async (req, res) => {
  try {
    const { fecha } = req.query;
    const resumen = await contabilidadService.obtenerResumenCierreCaja(fecha);
    
    res.status(200).json({
      success: true,
      data: resumen
    });
  } catch (error) {
    console.error('Error al obtener resumen cierre caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen de cierre de caja',
      error: error.message
    });
  }
};

const crearCierreCaja = async (req, res) => {
  try {
    const { empleado_id, observaciones } = req.body;

    if (!empleado_id) {
      return res.status(400).json({
        success: false,
        message: 'Error: empleado_id requerido'
      });
    }

    const resultado = await contabilidadService.crearCierreCaja(empleado_id, observaciones);
    
    res.status(201).json({
      success: true,
      message: 'Cierre de caja registrado exitosamente',
      data: resultado
    });
  } catch (error) {
    console.error('Error al crear cierre de caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear cierre de caja',
      error: error.message
    });
  }
};

//? === Obtener ventas archivadas (historico de cierres) ===
const getVentasArchivadas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const ventas = await contabilidadService.getVentasArchivadas(fechaInicio, fechaFin);
    const ventasConFormato = ventas.map(venta => ({
      ...venta,
      monto_formateado: parseFloat(venta.monto || 0).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })
    }));
    res.status(200).json({
      success: true,
      message: 'Ventas archivadas obtenidas exitosamente',
      data: ventasConFormato
    });
  } catch (error) {
    console.error('Error al obtener ventas archivadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas archivadas',
      error: error.message
    });
  }
};

//? === Obtener histórico de cierres de caja ===
const getCierresCajaHistorico = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const cierres = await contabilidadService.getCierresCajaHistorico(fechaInicio, fechaFin);
    const cierresConFormato = cierres.map(cierre => ({
      ...cierre,
      total_formateado: parseFloat(cierre.total || 0).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })
    }));
    res.status(200).json({
      success: true,
      message: 'Histórico de cierres obtenido exitosamente',
      data: cierresConFormato
    });
  } catch (error) {
    console.error('Error al obtener histórico de cierres:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener histórico de cierres',
      error: error.message
    });
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
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerResumenCierreCaja,
  crearCierreCaja,
  getVentasArchivadas,
  getCierresCajaHistorico
};
