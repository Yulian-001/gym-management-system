// Funciones auxiliares para el módulo de Contabilidad

/**
 * Crear egreso nuevo
 * @param {string} concepto - Concepto del egreso
 * @param {number} monto - Monto del egreso
 * @param {string} categoria - Categoría (alquiler, servicios, salarios, etc)
 * @param {string} descripcion - Descripción adicional
 * @param {string} metodo_pago - Método de pago (efectivo, tarjeta, transferencia, cheque)
 * @param {number} autorizado_por - ID del empleado que autoriza
 */
export const crearEgreso = async (concepto, monto, categoria, descripcion, metodo_pago, autorizado_por) => {
  try {
    const response = await fetch('http://localhost:3001/Api/contabilidad/egresos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        concepto,
        monto: parseFloat(monto),
        categoria,
        descripcion: descripcion || '',
        metodo_pago,
        autorizado_por: parseInt(autorizado_por)
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al crear egreso:', error);
    return {
      success: false,
      message: 'Error al crear egreso',
      error: error.message
    };
  }
};

/**
 * Obtener empleados activos
 */
export const obtenerEmpleados = async () => {
  try {
    const response = await fetch('http://localhost:3001/Api/contabilidad/empleados');
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    return [];
  }
};

/**
 * Formatear moneda
 * @param {number} valor - Valor a formatear
 * @returns {string} Valor formateado
 */
export const formatearMoneda = (valor) => {
  return parseFloat(valor || 0).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formatear fecha
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatear hora
 * @param {string} hora - Hora en formato HH:mm:ss
 * @returns {string} Hora formateada
 */
export const formatearHora = (hora) => {
  if (!hora) return '-';
  return hora.substring(0, 5);
};

/**
 * Obtener color según estado
 * @param {string} estado - Estado del registro
 * @returns {string} Clase CSS para el color
 */
export const getColorPorEstado = (estado) => {
  const colores = {
    'pagado': '#27cf8e',
    'pendiente': '#ff9800',
    'cancelado': '#f44336',
    'completado': '#27cf8e',
    'abierto': '#2683ff',
    'cerrado': '#27cf8e',
    'autorizado': '#27cf8e',
    'rechazado': '#f44336'
  };
  return colores[estado] || '#666';
};

/**
 * Obtener etiqueta según método de pago
 * @param {string} metodo - Método de pago
 * @returns {string} Etiqueta formateada
 */
export const getEtiquetaPago = (metodo) => {
  const etiquetas = {
    'efectivo': '💵 Efectivo',
    'tarjeta': '💳 Tarjeta',
    'transferencia': '🏦 Transferencia',
    'cheque': '📄 Cheque'
  };
  return etiquetas[metodo] || metodo;
};

/**
 * Categorías de egresos predefinidas
 */
export const categoriasEgresos = [
  'Alquiler',
  'Servicios (Agua, Luz, Internet)',
  'Mantenimiento',
  'Salarios',
  'Proveedores',
  'Impuestos',
  'Marketing',
  'Seguros',
  'Otros'
];

/**
 * Métodos de pago disponibles
 */
export const metodosPago = [
  'efectivo',
  'tarjeta',
  'transferencia',
  'cheque'
];

/**
 * Validar datos de egreso
 * @param {object} datos - Datos a validar
 * @returns {object} { válido: booleano, errores: array }
 */
export const validarDatosEgreso = (datos) => {
  const errores = [];

  if (!datos.concepto || datos.concepto.trim() === '') {
    errores.push('El concepto es requerido');
  }

  if (!datos.monto || parseFloat(datos.monto) <= 0) {
    errores.push('El monto debe ser mayor a 0');
  }

  if (!datos.categoria) {
    errores.push('La categoría es requerida');
  }

  if (!datos.metodo_pago) {
    errores.push('El método de pago es requerido');
  }

  if (!datos.autorizado_por) {
    errores.push('El usuario autorizador es requerido');
  }

  return {
    válido: errores.length === 0,
    errores: errores
  };
};

/**
 * Calcular totales por método de pago
 * @param {array} datos - Array de transacciones
 * @returns {object} Totales por método
 */
export const calcularTotalesPorMetodo = (datos) => {
  if (!Array.isArray(datos)) return {};

  const totales = {
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
    cheque: 0,
    total: 0
  };

  datos.forEach(item => {
    const monto = parseFloat(item.monto || 0);
    const metodo = item.metodo_pago || 'otros';

    if (totales.hasOwnProperty(metodo)) {
      totales[metodo] += monto;
    }

    totales.total += monto;
  });

  return totales;
};

/**
 * Exportar datos a CSV
 * @param {array} datos - Datos a exportar
 * @param {string} nombreArchivo - Nombre del archivo
 */
export const exportarACSV = (datos, nombreArchivo = 'contabilidad.csv') => {
  if (!Array.isArray(datos) || datos.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Obtener headers de la primera fila
  const headers = Object.keys(datos[0]);

  // Crear CSV
  let csv = headers.join(',') + '\n';
  datos.forEach(row => {
    const valores = headers.map(header => {
      const valor = row[header];
      // Escapar comillas en valores
      if (typeof valor === 'string' && valor.includes(',')) {
        return `"${valor.replace(/"/g, '""')}"`;
      }
      return valor;
    });
    csv += valores.join(',') + '\n';
  });

  // Descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nombreArchivo);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Obtener rango de fechas para filtros comunes
 * @param {string} tipo - 'hoy', 'semana', 'mes', 'año'
 * @returns {object} { fechaInicio, fechaFin }
 */
export const obtenerRangoFechas = (tipo) => {
  const hoy = new Date();
  let fechaInicio, fechaFin;

  switch (tipo) {
    case 'hoy':
      fechaInicio = new Date(hoy);
      fechaFin = new Date(hoy);
      break;
    case 'semana':
      fechaInicio = new Date(hoy.setDate(hoy.getDate() - 7));
      fechaFin = new Date();
      break;
    case 'mes':
      fechaInicio = new Date(hoy.setMonth(hoy.getMonth() - 1));
      fechaFin = new Date();
      break;
    case 'año':
      fechaInicio = new Date(hoy.setFullYear(hoy.getFullYear() - 1));
      fechaFin = new Date();
      break;
    default:
      fechaInicio = new Date(hoy);
      fechaFin = new Date(hoy);
  }

  return {
    fechaInicio: fechaInicio.toISOString().split('T')[0],
    fechaFin: fechaFin.toISOString().split('T')[0]
  };
};

export default {
  crearEgreso,
  obtenerEmpleados,
  formatearMoneda,
  formatearFecha,
  formatearHora,
  getColorPorEstado,
  getEtiquetaPago,
  categoriasEgresos,
  metodosPago,
  validarDatosEgreso,
  calcularTotalesPorMetodo,
  exportarACSV,
  obtenerRangoFechas
};
