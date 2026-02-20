import React, { useState, useEffect } from 'react';
import './ReportsStyle.css';

function HistoricoCierresReport() {
  const [cierresData, setcierresData] = useState([]);
  const [ventasArchivadasData, setventasArchivadasData] = useState([]);
  const [selectedCierre, setSelectedCierre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtroActivo, setFiltroActivo] = useState(false);

  // Cargar datos de cierres históricos
  const fetchCierresHistorico = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:3001/Api/contabilidad/cierres-historico';
      if (fechaInicio || fechaFin) {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const datos = await response.json();
        setcierresData(datos.data || []);
        setFiltroActivo(true);
      }
    } catch (error) {
      console.error('Error fetching cierres históricos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ventas archivadas de un cierre específico
  const fetchVentasArchivadas = async (idCierre) => {
    setLoading(true);
    try {
      let url = 'http://localhost:3001/Api/contabilidad/ventas-archivadas';
      if (fechaInicio || fechaFin) {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      if (response.ok) {
        const datos = await response.json();
        setventasArchivadasData(datos.data || []);
        setSelectedCierre(idCierre);
      }
    } catch (error) {
      console.error('Error fetching ventas archivadas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchCierresHistorico();
  }, []);

  const handleBuscar = () => {
    fetchCierresHistorico();
  };

  const handleLimpiar = () => {
    setFechaInicio('');
    setFechaFin('');
    setcierresData([]);
    setventasArchivadasData([]);
    setSelectedCierre(null);
    setFiltroActivo(false);
  };

  const formatearMoneda = (valor) => {
    return parseFloat(valor || 0).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="report-container">
      <h2>Histórico de Cierres de Caja</h2>

      {/* Filtros de Fecha */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Desde:</label>
          <input 
            type="date" 
            value={fechaInicio} 
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Hasta:</label>
          <input 
            type="date" 
            value={fechaFin} 
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <button onClick={handleBuscar} className="btn-buscar" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        <button onClick={handleLimpiar} className="btn-limpiar">
          Limpiar
        </button>
      </div>

      {/* Tabla de Cierres de Caja */}
      {filtroActivo && (
        <div className="report-section">
          <h3>Cierres de Caja Registrados</h3>
          {cierresData.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha de Cierre</th>
                  <th>Cerrado Por</th>
                  <th>Cantidad de Ventas</th>
                  <th>Total Ventas</th>
                  <th>Total Efectivo</th>
                  <th>Total Tarjeta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cierresData.map((cierre) => (
                  <tr key={cierre.id} className={selectedCierre === cierre.id ? 'selected' : ''}>
                    <td>{cierre.id}</td>
                    <td>{formatearFecha(cierre.fecha_resumen)}</td>
                    <td>{cierre.cerrado_por_nombre || cierre.cerrado_por || 'N/A'}</td>
                    <td>{cierre.cantidad_ventas || 0}</td>
                    <td>{formatearMoneda(cierre.total_ingresos || cierre.total_ventas_cierre)}</td>
                    <td>{formatearMoneda(cierre.total_ventas_efectivo)}</td>
                    <td>{formatearMoneda(cierre.total_ventas_tarjeta)}</td>
                    <td>
                      <button 
                        className="btn-ver-detalles"
                        onClick={() => fetchVentasArchivadas(cierre.id)}
                      >
                        Ver Ventas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No hay cierres de caja en el rango de fechas seleccionado.</p>
          )}
        </div>
      )}

      {/* Tabla de Ventas Archivadas */}
      {selectedCierre && ventasArchivadasData.length > 0 && (
        <div className="report-section">
          <h3>Ventas Archivadas del Cierre #{selectedCierre}</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
                <th>Método de Pago</th>
              </tr>
            </thead>
            <tbody>
              {ventasArchivadasData.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.hora_venta || venta.fecha_venta.slice(11, 16) || 'N/A'}</td>
                  <td>{venta.cliente_nombre || 'Cliente Anónimo'}</td>
                  <td>{venta.descripcion}</td>
                  <td>{venta.cantidad}</td>
                  <td>{formatearMoneda(venta.precio_unitario)}</td>
                  <td>{formatearMoneda(venta.monto)}</td>
                  <td>{venta.metodo_pago || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCierre && ventasArchivadasData.length === 0 && !loading && (
        <div className="report-section">
          <p className="no-data">No hay ventas archivadas para este cierre.</p>
        </div>
      )}
    </div>
  );
}

export default HistoricoCierresReport;
