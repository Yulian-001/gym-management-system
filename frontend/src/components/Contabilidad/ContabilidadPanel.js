import React, { useState, useEffect } from 'react';
import './ContabilidadStyle.css';
import EmployeeRegistrationForm from './EmployeeRegistrationForm';
import EmployeeListPanel from './EmployeeListPanel';
import { createRoot } from 'react-dom/client';
import { showConfirmModal } from '../functions/modalFunctions';
import { useAuth } from '../../context/AuthContext';

const ContabilidadPanel = ({ option }) => {
  const [resumenData, setResumenData] = useState(null);
  const [ventasData, setVentasData] = useState([]);
  const [egresosData, setEgresosData] = useState([]);
  const [cierreCajaData, setCierreCajaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cierreProcesando, setCierreProcesando] = useState(false);
  const [employeeRefresh, setEmployeeRefresh] = useState(0);
  const { user } = useAuth();

  //? Actualizar estado de la venta
  //? Cargar resumen de caja
  const cargarResumen = async (fechaSeleccionada = null) => {
    setLoading(true);
    setError(null);
    try {
      const endpointFecha = fechaSeleccionada || fecha;
      const response = await fetch(`http://localhost:3001/Api/contabilidad/resumen-general?fecha=${endpointFecha}`);
      const result = await response.json();

      if (result.success) {
        setResumenData(result.data);
      } else {
        setError('No hay datos para esta fecha');
      }
    } catch (err) {
      console.error('Error al cargar resumen:', err);
      setError('Error al cargar el resumen de caja');
    }
    setLoading(false);
  };

  //? Cargar ventas del día
  const cargarVentas = async (fechaSeleccionada = null) => {
    setLoading(true);
    setError(null);
    try {
      const fechaParam = fechaSeleccionada || fecha;
      console.log(`📡 Cargando ventas para: ${fechaParam}`);
      const response = await fetch(`http://localhost:3001/Api/contabilidad/ventas-dia?fecha=${fechaParam}`);
      const result = await response.json();

      if (result.success) {
        console.log(`✅ ${result.data?.length || 0} ventas encontradas`);
        setVentasData(result.data || []);
      } else {
        console.warn('⚠️ Sin ventas para esta fecha');
        setVentasData([]);
      }
    } catch (err) {
      console.error('❌ Error cargando ventas:', err);
      setError('Error al cargar ventas del día');
    }
    setLoading(false);
  };

  //? Cargar egresos del día
  const cargarEgresos = async (fechaSeleccionada = null) => {
    setLoading(true);
    setError(null);
    try {
      const endpointFecha = fechaSeleccionada || fecha;
      const response = await fetch(`http://localhost:3001/Api/contabilidad/egresos?fecha=${endpointFecha}`);
      const result = await response.json();

      if (result.success) {
        setEgresosData(result.data || []);
      } else {
        setEgresosData([]);
      }
    } catch (err) {
      console.error('Error al cargar egresos:', err);
      setError('Error al cargar egresos');
    }
    setLoading(false);
  };

  //? Cargar resumen de cierre de caja
  const cargarCierreCaja = async (fechaSeleccionada = null) => {
    setLoading(true);
    setError(null);
    try {
      const endpointFecha = fechaSeleccionada || fecha;
      const response = await fetch(`http://localhost:3001/Api/contabilidad/cierre-resumen?fecha=${endpointFecha}`);
      const result = await response.json();

      if (result.success) {
        setCierreCajaData(result.data);
      } else {
        setError('No hay datos disponibles para calcular el cierre');
      }
    } catch (err) {
      console.error('Error al cargar cierre de caja:', err);
      setError('Error al cargar cierre de caja');
    }
    setLoading(false);
  };

  //? Registrar cierre de caja
  const registrarCierreCaja = async () => {
    setCierreProcesando(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/Api/contabilidad/cierre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          empleado_id: user?.id || 1,
          observaciones: 'Cierre diario'
        })
      });

      const result = await response.json();

      if (result.success) {
        setError(null);
        alert('Cierre de caja registrado exitosamente');
        cargarCierreCaja(fecha);
      } else {
        setError(result.message || 'Error al registrar cierre');
      }
    } catch (err) {
      console.error('Error al registrar cierre:', err);
      setError('Error al registrar cierre de caja');
    }
    setCierreProcesando(false);
  };

  //? Abrir modal para registrar empleado
  const abrirModalRegistroEmpleado = () => {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-register-employee-' + Date.now();
    document.body.appendChild(modalContainer);

    const root = createRoot(modalContainer);

    const closeModal = () => {
      root.unmount();
      if (modalContainer.parentNode) {
        document.body.removeChild(modalContainer);
      }
      setEmployeeRefresh(prev => prev + 1);
    };

    root.render(
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ margin: 0, color: '#2683ff', fontSize: '1.5rem' }}>
              Registrar Nuevo Empleado
            </h2>
            <button
              onClick={closeModal}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          <EmployeeRegistrationForm onSuccess={closeModal} />
        </div>
      </div>
    );
  };

  //? Abrir modal para editar empleado
  const abrirModalEditarEmpleado = (employee) => {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-edit-employee-' + Date.now();
    document.body.appendChild(modalContainer);

    const root = createRoot(modalContainer);

    const closeModal = () => {
      root.unmount();
      if (modalContainer.parentNode) {
        document.body.removeChild(modalContainer);
      }
      setEmployeeRefresh(prev => prev + 1);
    };

    root.render(
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ margin: 0, color: '#2683ff', fontSize: '1.5rem' }}>
              Editar Empleado
            </h2>
            <button
              onClick={closeModal}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          <EmployeeRegistrationForm employee={employee} onSuccess={closeModal} onCancel={closeModal} />
        </div>
      </div>
    );
  };

  //? Eliminar empleado
  const handleDeleteEmpleado = (id) => {
    showConfirmModal({
      message: '¿Eliminar empleado? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          const resp = await fetch(`http://localhost:3001/Api/contabilidad/empleados/${id}`, {
            method: 'DELETE'
          });
          const result = await resp.json();
          if (result.success) {
            setEmployeeRefresh(prev => prev + 1);
            alert('Empleado eliminado exitosamente');
          } else {
            alert(result.message || 'Error al eliminar empleado');
          }
        } catch (err) {
          console.error('Error eliminar empleado:', err);
          alert('Error al eliminar empleado');
        }
      },
      onCancel: () => {
        console.log('Eliminación cancelada');
      }
    });
  };

  //? Efecto inicial - Cargar datos cuando cambia la opción o fecha
  useEffect(() => {
    console.log(`📋 Opción: ${option}, Fecha: ${fecha}`);
    if (option === 'resumen') {
      cargarResumen();
      cargarVentas();
    } else if (option === 'ventas') {
      cargarVentas();
    } else if (option === 'egresos') {
      cargarEgresos();
    } else if (option === 'cierre') {
      cargarCierreCaja();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, fecha]);

  //? Listener para cualquier venta creada (desde Entradas o desde Administración→Ventas)
  useEffect(() => {
    const refrescarSiEsNecesario = () => {
      if (option === 'ventas' || option === 'resumen') {
        cargarVentas();
      }
    };

    window.addEventListener('entradaGuardadaConEvento', refrescarSiEsNecesario);
    window.addEventListener('saleCreated', refrescarSiEsNecesario);
    return () => {
      window.removeEventListener('entradaGuardadaConEvento', refrescarSiEsNecesario);
      window.removeEventListener('saleCreated', refrescarSiEsNecesario);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option]);

  //? Formatear moneda
  const formatearMoneda = (valor) => {
    return parseFloat(valor || 0).toFixed(2);
  };

  return (
    <div className="contabilidad-content">
      {/* Selector de fecha */}
      <div className="contabilidad-date-selector">
        <label>Fecha: </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="date-input"
        />
      </div>

      {/* Indicador de carga */}
      {loading && <div className="loading-indicator">Cargando datos...</div>}

      {/* Mensajes de error */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* CONTENIDO: Resumen de Caja */}
      {option === 'resumen' && !loading && (
        <div className="resumen-tab-content">
          {resumenData ? (
            <>
              {/* Cajas de métricas principales */}
              <div className="metricas-grid">
                <div className="metrica-box ingresos">
                  <div className="metrica-label">Total Ingresos</div>
                  <div className="metrica-valor">
                    ${formatearMoneda(resumenData.total_ingresos)}
                  </div>
                  <div className="metrica-cantidad">
                    {resumenData.cantidad_ventas || 0} ventas
                  </div>
                </div>

                <div className="metrica-box egresos">
                  <div className="metrica-label">Total Egresos</div>
                  <div className="metrica-valor">
                    ${formatearMoneda(resumenData.total_egresos)}
                  </div>
                  <div className="metrica-cantidad">
                    {resumenData.cantidad_egresos || 0} egresos
                  </div>
                </div>

                <div className="metrica-box saldo">
                  <div className="metrica-label">Saldo Neto</div>
                  <div className="metrica-valor">
                    ${formatearMoneda(resumenData.saldo_neto)}
                  </div>
                </div>
              </div>

              {/* Desglose por método de pago */}
              <div className="desglose-metodos">
                <h3>Desglose por Método de Pago</h3>
                <div className="metodos-grid">
                  <div className="metodo-card">
                    <div className="metodo-titulo">Efectivo</div>
                    <div className="metodo-ingresos">
                      Ingresos: ${formatearMoneda(resumenData.total_ventas_efectivo)}
                    </div>
                    <div className="metodo-egresos">
                      Egresos: ${formatearMoneda(resumenData.total_egresos_efectivo)}
                    </div>
                    <div className="metodo-neto">
                      Neto: ${formatearMoneda(
                        parseFloat(resumenData.total_ventas_efectivo) -
                          parseFloat(resumenData.total_egresos_efectivo)
                      )}
                    </div>
                  </div>

                  <div className="metodo-card">
                    <div className="metodo-titulo">Tarjeta</div>
                    <div className="metodo-ingresos">
                      Ingresos: ${formatearMoneda(resumenData.total_ventas_tarjeta)}
                    </div>
                    <div className="metodo-egresos">
                      Egresos: ${formatearMoneda(resumenData.total_egresos_tarjeta)}
                    </div>
                    <div className="metodo-neto">
                      Neto: ${formatearMoneda(
                        parseFloat(resumenData.total_ventas_tarjeta) -
                          parseFloat(resumenData.total_egresos_tarjeta)
                      )}
                    </div>
                  </div>

                  <div className="metodo-card">
                    <div className="metodo-titulo">Transferencia</div>
                    <div className="metodo-ingresos">
                      Ingresos: ${formatearMoneda(resumenData.total_ventas_transferencia)}
                    </div>
                    <div className="metodo-egresos">
                      Egresos: ${formatearMoneda(resumenData.total_egresos_transferencia)}
                    </div>
                    <div className="metodo-neto">
                      Neto: ${formatearMoneda(
                        parseFloat(resumenData.total_ventas_transferencia) -
                          parseFloat(resumenData.total_egresos_transferencia)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-data-message">No hay datos de caja para esta fecha</div>
          )}
        </div>
      )}

      {/* CONTENIDO: Ventas del Día */}
      {option === 'ventas' && !loading && (
        <div className="ventas-tab-content">
          {ventasData && ventasData.length > 0 ? (
            <>
              <div className="ventas-table-wrapper">
                <table className="ventas-table">
                  <thead>
                    <tr>
                      <th style={{ width:'6%' }}>ID</th>
                      <th style={{ width:'20%' }}>Cliente</th>
                      <th style={{ width:'15%' }}>Fecha</th>
                      <th style={{ width:'25%' }}>Descripción</th>
                      <th style={{ width:'8%' }}>Cant</th>
                      <th style={{ width:'12%' }}>Precio Unit.</th>
                      <th style={{ width:'12%' }}>Total</th>
                      <th style={{ width:'15%' }}>Método Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasData.map((venta) => (
                      <tr key={venta.id}>
                        <td>{venta.id}</td>
                        <td>{venta.cliente_nombre || 'Sin cliente'}</td>
                        <td style={{ whiteSpace:'nowrap' }}>{venta.fecha_venta ? new Date(venta.fecha_venta).toLocaleDateString() : '-'}</td>
                        <td>{venta.descripcion || venta.plan_nombre || '-'}</td>
                        <td>{venta.cantidad || 1}</td>
                        <td>${venta.precio_unitario ? parseFloat(venta.precio_unitario).toLocaleString('es-CO', {minimumFractionDigits: 2}) : '0.00'}</td>
                        <td>${formatearMoneda(venta.monto)}</td>
                        <td className={`metodo-${venta.metodo_pago}`}>
                          {venta.metodo_pago}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen de ventas */}
              <div className="ventas-resumen">
                <div className="resumen-item">
                  <span className="label">Total Ventas:</span>
                  <span className="valor">
                    ${formatearMoneda(
                      ventasData.reduce((sum, v) => sum + parseFloat(v.monto || 0), 0)
                    )}
                  </span>
                </div>
                <div className="resumen-item">
                  <span className="label">Cantidad de Transacciones:</span>
                  <span className="valor">{ventasData.length}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="no-data-message">No hay ventas registradas</div>
          )}
        </div>
      )}

      {/* CONTENIDO: Egresos */}
      {option === 'egresos' && !loading && (
        <div className="egresos-tab-content">
          {egresosData && egresosData.length > 0 ? (
            <>
              <div className="egresos-table-wrapper">
                <table className="egresos-table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Categoría</th>
                      <th>Monto</th>
                      <th>Método Pago</th>
                      <th>Autorizado Por</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {egresosData.map((egreso) => (
                      <tr key={egreso.id}>
                        <td>{egreso.concepto}</td>
                        <td>{egreso.categoria}</td>
                        <td>${formatearMoneda(egreso.monto)}</td>
                        <td className={`metodo-${egreso.metodo_pago}`}>
                          {egreso.metodo_pago}
                        </td>
                        <td>{egreso.autorizado_por_nombre || '-'}</td>
                        <td className={`estado-${egreso.estado}`}>
                          {egreso.estado}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen de egresos */}
              <div className="egresos-resumen">
                <div className="resumen-item">
                  <span className="label">Total Egresos:</span>
                  <span className="valor">
                    ${formatearMoneda(
                      egresosData.reduce((sum, e) => sum + parseFloat(e.monto || 0), 0)
                    )}
                  </span>
                </div>
                <div className="resumen-item">
                  <span className="label">Cantidad de Registros:</span>
                  <span className="valor">{egresosData.length}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="no-data-message">No hay egresos registrados para esta fecha</div>
          )}
        </div>
      )}

      {/* CONTENIDO: Cierre de Caja */}
      {option === 'cierre' && !loading && (
        <div className="cierre-caja-content">
          {cierreCajaData ? (
            <>
              {/* Cajas de métricas principales */}
              <div className="metricas-grid">
                <div className="metrica-box ingresos">
                  <div className="metrica-label">Total Ingresos</div>
                  <div className="metrica-valor">
                    ${formatearMoneda(cierreCajaData.resumen.total_ingresos)}
                  </div>
                  <div className="metrica-cantidad">
                    {cierreCajaData.resumen.cantidad_ventas || 0} ventas
                  </div>
                </div>

                <div className="metrica-box egresos">
                  <div className="metrica-label">Total Egresos</div>
                  <div className="metrica-valor">
                    ${formatearMoneda(cierreCajaData.resumen.total_egresos)}
                  </div>
                  <div className="metrica-cantidad">
                    {cierreCajaData.resumen.cantidad_egresos || 0} egresos
                  </div>
                </div>

                <div className="metrica-box saldo">
                  <div className="metrica-label">Saldo Neto</div>
                  <div className="metrica-valor">
                    ${formatearMoneda(cierreCajaData.resumen.saldo_neto)}
                  </div>
                </div>
              </div>

              {/* Ventas por Vendedor */}
              <div className="cierre-section">
                <h3>Ventas por Vendedor</h3>
                {cierreCajaData.ventasPorVendedor && cierreCajaData.ventasPorVendedor.length > 0 ? (
                  <table className="cierre-table">
                    <thead>
                      <tr>
                        <th>Vendedor</th>
                        <th>Cargo</th>
                        <th>Cantidad Ventas</th>
                        <th>Total Vendido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cierreCajaData.ventasPorVendedor.map((vendedor) => (
                        <tr key={vendedor.empleado_id}>
                          <td>{vendedor.vendedor}</td>
                          <td>{vendedor.cargo}</td>
                          <td>{vendedor.cantidad_ventas}</td>
                          <td>${formatearMoneda(vendedor.total_vendido)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data-message">Sin ventas</p>
                )}
              </div>

              {/* Planes Vendidos */}
              <div className="cierre-section">
                <h3>Planes Vendidos</h3>
                {cierreCajaData.planes && cierreCajaData.planes.length > 0 ? (
                  <table className="cierre-table">
                    <thead>
                      <tr>
                        <th>Plan</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad Vendida</th>
                        <th>Total Generado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cierreCajaData.planes
                        .filter(plan => plan && plan.id) //? excluir ventas sin plan (productos)
                        .map((plan) => (
                        <tr key={plan.id}>
                          <td>{plan.plan_nombre}</td>
                          <td>{isFinite(parseFloat(plan.precio)) ? `$${formatearMoneda(plan.precio)}` : 'N/A'}</td>
                          <td>{plan.cantidad_vendida}</td>
                          <td>${formatearMoneda(plan.total_generado)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data-message">Sin planes vendidos</p>
                )}
              </div>

              {/*? Egresos por Categoría eliminado - mantenemos espacio si se necesita en el futuro */}

              {/* Botón para registrar cierre */}
              <div className="cierre-actions">
                <button
                  className="btn-registrar-cierre"
                  onClick={registrarCierreCaja}
                  disabled={cierreProcesando}
                >
                  {cierreProcesando ? 'Registrando...' : 'Registrar Cierre de Caja'}
                </button>
              </div>
            </>
          ) : (
            <div className="no-data-message">No hay datos disponibles</div>
          )}
        </div>
      )}

      {/* CONTENIDO: Registrar Empleados */}
      {option === 'empleados' && (
        <div className="empleados-tab-content">
          <div className="empleados-header">
            <button
              className="btn-nuevo-empleado"
              onClick={abrirModalRegistroEmpleado}
            >
              +  Nuevo Empleado
            </button>
          </div>
          <EmployeeListPanel refreshTrigger={employeeRefresh} onEdit={abrirModalEditarEmpleado} onDelete={handleDeleteEmpleado} />
        </div>
      )}
    </div>
  );
};

export default ContabilidadPanel;
