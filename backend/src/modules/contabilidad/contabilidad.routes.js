const express = require('express');
const router = express.Router();
const contabilidadController = require('./contabilidad.controller');

// === RESUMEN DE CAJA ===
router.get('/resumen-hoy', contabilidadController.getResumenCajaHoy);
// La ruta 'resumen-historico' fue eliminada porque la vista Histórico fue removida del frontend
router.post('/resumen', contabilidadController.crearResumenCaja);

// === VENTAS DEL DÍA ===
router.get('/ventas-dia', contabilidadController.getVentasDelDia);
router.get('/ventas-totales-metodo', contabilidadController.getTotalVentasPorMetodo);

// === EGRESOS ===
router.get('/egresos', contabilidadController.getEgresosDelDia);
router.post('/egresos', contabilidadController.crearEgreso);

// === RESUMEN GENERAL ===
router.get('/resumen-general', contabilidadController.calcularResumenDelDia);

// === EMPLEADOS ===
router.get('/empleados', contabilidadController.getEmpleadosActivos);
router.post('/empleados', contabilidadController.crearEmpleado);
router.put('/empleados/:id', contabilidadController.actualizarEmpleado);
router.delete('/empleados/:id', contabilidadController.eliminarEmpleado);

// === CIERRE DE CAJA ===
router.get('/cierre-resumen', contabilidadController.obtenerResumenCierreCaja);
router.post('/cierre', contabilidadController.crearCierreCaja);

// === HISTÓRICO DE CIERRES Y VENTAS ARCHIVADAS ===
router.get('/ventas-archivadas', contabilidadController.getVentasArchivadas);
router.get('/cierres-historico', contabilidadController.getCierresCajaHistorico);

module.exports = router;
