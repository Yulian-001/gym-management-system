import React, { useEffect, useState } from 'react';
import './EstadoStyle.css';
import { handleCongelar, handleDescongelar } from '../functions/estadoFunctions';

function EstadoPanel() {
  const [clientesCongelados, setClientesCongelados] = useState([]);
  const [clientesDescongelados, setClientesDescongelados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [totalCongelados, setTotalCongelados] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pestaña, setPestaña] = useState('congelados'); // congelados | descongelados | buscar

  // Cargar congelados
  useEffect(() => {
    const fetchCongelados = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/Api/estado/congelados');
        if (!response.ok) throw new Error('Error al cargar congelados');
        const data = await response.json();
        setClientesCongelados(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching congelados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCongelados();
  }, []);

  // Cargar descongelados
  useEffect(() => {
    const fetchDescongelados = async () => {
      try {
        const response = await fetch('http://localhost:3001/Api/estado/descongelados');
        if (response.ok) {
          const data = await response.json();
          setClientesDescongelados(data);
        }
      } catch (err) {
        console.error('Error fetching descongelados:', err);
      }
    };

    fetchDescongelados();
  }, []);

  // Cargar total de congelados
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const response = await fetch('http://localhost:3001/Api/estado/total-congelados');
        if (response.ok) {
          const data = await response.json();
          setTotalCongelados(data.total);
        }
      } catch (err) {
        console.error('Error fetching total:', err);
      }
    };

    fetchTotal();
  }, []);

  // Buscar cliente
  const handleBuscar = async (valor) => {
    setBusqueda(valor);

    if (valor.trim() === '') {
      setResultadosBusqueda([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/Api/estado/buscar?busqueda=${encodeURIComponent(valor)}`);
      if (response.ok) {
        const data = await response.json();
        setResultadosBusqueda(data);
      }
    } catch (err) {
      console.error('Error searching cliente:', err);
    }
  };

  // Refrescar datos
  const refrescar = async () => {
    try {
      const response = await fetch('http://localhost:3001/Api/estado/congelados');
      if (response.ok) {
        const data = await response.json();
        setClientesCongelados(data);
      }

      const totalRes = await fetch('http://localhost:3001/Api/estado/total-congelados');
      if (totalRes.ok) {
        const totalData = await totalRes.json();
        setTotalCongelados(totalData.total);
      }

      const desRes = await fetch('http://localhost:3001/Api/estado/descongelados');
      if (desRes.ok) {
        const desData = await desRes.json();
        setClientesDescongelados(desData);
      }
    } catch (err) {
      console.error('Error refreshing:', err);
    }
  };

  if (loading) return <div className="estado-container"><p>Cargando información...</p></div>;
  if (error) return <div className="estado-container"><p>Error: {error}</p></div>;

  return (
    <div className="estado-container">
      <h1 style={{ color: '#2683ff', marginBottom: '1.5rem', textAlign: 'center' }}>Panel de Estado - Congelados</h1>

      {/* Contador de congelados */}
      <div className="estado-contador">
        <div className="contador-box">
          <h2>Clientes Congelados</h2>
          <div className="numero">{totalCongelados}</div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="estado-pestanas">
        <button
          className={`pestana ${pestaña === 'congelados' ? 'activa' : ''}`}
          onClick={() => setPestaña('congelados')}
        >
          Congelados ({clientesCongelados.length})
        </button>
        <button
          className={`pestana ${pestaña === 'buscar' ? 'activa' : ''}`}
          onClick={() => setPestaña('buscar')}
        >
          Buscar Cliente
        </button>
        <button
          className={`pestana ${pestaña === 'descongelados' ? 'activa' : ''}`}
          onClick={() => setPestaña('descongelados')}
        >
          Histórico ({clientesDescongelados.length})
        </button>
      </div>

      {/* Contenido de Congelados */}
      {pestaña === 'congelados' && (
        <div className="pestaña-contenido">
          <div className="estado-table-wrapper">
            <table className="estado-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cédula</th>
                  <th>Plan</th>
                  <th>Fecha Congelación</th>
                  <th>Días Congelado</th>
                  <th>Días Restantes Plan</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesCongelados.length > 0 ? (
                  clientesCongelados.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.cedula}</td>
                      <td>{cliente.plan_nombre}</td>
                      <td>{new Date(cliente.fecha_congelacion).toLocaleDateString()}</td>
                      <td>{cliente.dias_congelado} días</td>
                      <td>
                        <span style={{ color: cliente.dias_restantes_plan > 0 ? '#4CAF50' : '#f44336' }}>
                          {cliente.dias_restantes_plan > 0 ? cliente.dias_restantes_plan : 'Vencido'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-descongelar"
                          onClick={() => handleDescongelar(cliente.congelado_id, refrescar)}
                        >
                           Descongelar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No hay clientes congelados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido de Búsqueda */}
      {pestaña === 'buscar' && (
        <div className="pestaña-contenido">
          <div className="estado-busqueda">
            <input
              type="text"
              placeholder="Busca por nombre o cédula..."
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
              className="estado-search"
            />
          </div>

          {resultadosBusqueda.length > 0 && (
            <div className="estado-table-wrapper">
              <table className="estado-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Cédula</th>
                    <th>Plan</th>
                    <th>Estado</th>
                    <th>Fecha Inicio Plan</th>
                    <th>Fecha Vencimiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosBusqueda.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.cedula}</td>
                      <td>{cliente.plan_nombre}</td>
                      <td>
                        <span style={{
                          color: cliente.congelado_id ? '#ff9800' : '#4CAF50',
                          fontWeight: 'bold'
                        }}>
                          {cliente.congelado_id ? '❄️ Congelado' : '✓ Activo'}
                        </span>
                      </td>
                      <td>{new Date(cliente.fecha_inicio_plan).toLocaleDateString()}</td>
                      <td>{new Date(cliente.fecha_vencimiento_plan).toLocaleDateString()}</td>
                      <td>
                        {cliente.congelado_id ? (
                          <button
                            className="btn-descongelar"
                            onClick={() => handleDescongelar(cliente.congelado_id, refrescar)}
                          >
                            ✓ Descongelar
                          </button>
                        ) : (
                          <button
                            className="btn-congelar"
                            onClick={() => handleCongelar(cliente.id, refrescar)}
                          >
                            ❄️ Congelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {busqueda && resultadosBusqueda.length === 0 && (
            <p className="no-data">No se encontraron clientes</p>
          )}
        </div>
      )}

      {/* Contenido de Histórico */}
      {pestaña === 'descongelados' && (
        <div className="pestaña-contenido">
          <div className="estado-table-wrapper">
            <table className="estado-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cédula</th>
                  <th>Plan</th>
                  <th>Fecha Congelación</th>
                  <th>Fecha Descongelación</th>
                  <th>Días Congelado</th>
                  <th>Días Restantes Plan</th>
                </tr>
              </thead>
              <tbody>
                {clientesDescongelados.length > 0 ? (
                  clientesDescongelados.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.cedula}</td>
                      <td>{cliente.plan_nombre}</td>
                      <td>{new Date(cliente.fecha_congelacion).toLocaleDateString()}</td>
                      <td>{new Date(cliente.fecha_descongelacion).toLocaleDateString()}</td>
                      <td>{cliente.dias_congelado} días</td>
                      <td>
                        <span style={{ color: cliente.dias_restantes_plan > 0 ? '#4CAF50' : '#f44336' }}>
                          {cliente.dias_restantes_plan > 0 ? cliente.dias_restantes_plan : 'Vencido'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No hay histórico de descongelaciones</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default EstadoPanel;
