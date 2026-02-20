import React, { useEffect, useState } from 'react';
import './SalesStyle.css';
import { handleAddSale, 
    handleEditSale,
     handleDeleteSale,
    } from '../functions/salesFunctions';
import { EditIcon,TrashIcon } from '../../icons';
import { useAuth } from '../../context/AuthContext';

function SalesTable() {
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const isRecepcionista = user?.rol === 'recepcionista';

  // Cargar clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3001/Api/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        }
      } catch (err) {
        console.error('Error loading clients:', err);
      }
    };

    fetchClients();
  }, []);

  // Cargar ventas
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/Api/sales?empleado_id=${user?.id || ''}&rol=${user?.rol || ''}`);
        if (!response.ok) throw new Error('Error al cargar ventas');
        const data = await response.json();
        // Filtrar: excluir ventas de eventos (solo mostrar planes y productos)
        const ventasSinEventos = data.filter(sale => !sale.evento);
        setAllSales(ventasSinEventos);
        setSales(ventasSinEventos);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching sales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Escuchar evento global 'saleCreated' para refrescar tabla
  useEffect(() => {
    const handler = () => refreshSales();
    window.addEventListener('saleCreated', handler);
    return () => window.removeEventListener('saleCreated', handler);
  }, []);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSales(allSales);
    } else {
      const results = allSales.filter(sale =>
        sale.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSales(results);
    }
  }, [searchTerm, allSales]);

  // Refrescar tabla
  const refreshSales = async () => {
    try {
      const response = await fetch(`http://localhost:3001/Api/sales?empleado_id=${user?.id || ''}&rol=${user?.rol || ''}`);
      if (response.ok) {
        const data = await response.json();
        // Filtrar: excluir ventas de eventos
        const ventasSinEventos = data.filter(sale => !sale.evento);
        setAllSales(ventasSinEventos);
        setSales(ventasSinEventos);
      }
    } catch (err) {
      console.error('Error refreshing sales:', err);
    }
  };

  // Obtener nombre del cliente por ID
  const getClientName = (clientId) => {
    if (!clientId) return 'Sin cliente';
    const client = clients.find(c => c.id === clientId);
    return client ? client.nombre : `Cliente ${clientId}`;
  };

  // Actualizar estado de la venta (confirmación)
  const updateSaleStatus = async (id, newStatus) => {
    try {
      const resp = await fetch(`http://localhost:3001/Api/sales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus })
      });
      if (!resp.ok) throw new Error('Error actualizando estado');
      const updated = await resp.json();
      // Actualizar estado local
      setSales(prev => prev.map(s => s.id === updated.id ? { ...s, estado: updated.estado } : s));
      setAllSales(prev => prev.map(s => s.id === updated.id ? { ...s, estado: updated.estado } : s));
    } catch (err) {
      console.error('Error updating sale status', err);
      alert('No se pudo actualizar el estado.');
    }
  };

  if (loading) return <div className="sales-container"><p>Cargando ventas...</p></div>;
  if (error) return <div className="sales-container"><p>Error: {error}</p></div>;

  return (
    <div style={{ padding:'1.5rem'}} className="sales-container">
      <h1 style={{ color:'#2683ff', display: 'flex', justifyContent: 'start', alignItems: 'center'}}>Registro de Ventas</h1>

      <div className="sales-controls">
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sales-search"
        />
        <button
          className="sales-btn-add"
          onClick={() => handleAddSale(refreshSales, clients, user)}
        >
          + Nueva Venta
        </button>
      </div>

      <div className="sales-table-wrapper">

        <table className="sales-table" >
          <thead>
            <tr >
              <th style={{ width:'12%' }}>ID</th>
              <th style={{ width:'25%' }}>Cliente</th>
              <th style={{ width:'18%' }}>Fecha</th>
              <th style={{ width:'30%' }}>Descripción</th>
              <th style={{ width:'15%' }}>Cant</th>
              <th style={{ width:'22%' }}>Precio Unit.</th>
              <th style={{ width:'22%' }}>Total</th>
              <th style={{ width:'30%' }}>Método Pago</th>
              <th style={{ width:'36%',whiteSpace:'normal', }}>Estado</th>
              {!isRecepcionista && <th style={{ width:'28%' }}>Acciones</th>}
              <th style={{ width:'30%', textAlign:'center',marginLeft:'1rem' }}>Confirmación</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map(sale => (
                <tr key={sale.id}>
                  <td  >{sale.id}</td>
                  <td style={{whiteSpace:'nowrap'}}>{getClientName(sale.cliente_id)}</td>
                  <td style={{ whiteSpace:'nowrap'}}>{new Date(sale.fecha_venta).toLocaleDateString()}</td>
                  <td>{sale.descripcion}</td>
                  <td>{sale.cantidad || 1}</td>
                  <td>${parseFloat(sale.precio_unitario || sale.monto || 0).toFixed(2)}</td>
                  <td>${parseFloat(sale.total || sale.monto || 0).toFixed(2)}</td>
                  <td>{sale.metodo_pago}</td>
                  <td style={{ padding:'0.3rem 0.1rem',marginTop:'0.8rem', width:'80%', whiteSpace:'nowrap'}} className={`estado-${sale.estado}`}>{sale.estado}</td>
                  {!isRecepcionista && (
                  <td className="sales-actions">
                    <button 
                      style={{ 
                        backgroundColor:'#d72727',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 0.6rem',
                        borderRadius: '6px',
                        cursor:'pointer',
                        fontSize:'13px',
                        marginBottom:'0.7rem',

                        transition: 'background-color 0.3s',
                      }}
                      title="Eliminar venta"
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#d72727'}
                      onClick={() => handleDeleteSale(sale.id, refreshSales)}>
                      <TrashIcon size={16} />
                    </button>

                    <button 
                      style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding:'0.5rem 0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer',

                        marginBottom:'0.7rem',
                        fontSize: '13px',
                        transition: 'background-color 0.3s' 
                      }}
                      title="Editar venta"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2750F5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                      onClick={() => handleEditSale(sale, refreshSales, clients)}>
                      <EditIcon size={16} />
                    </button>
                  </td>
                  )}
                  <td className="confirm-col" style={{ textAlign: 'center' }}>
                    <select 
                      value={sale.estado} 
                      onChange={(e) => updateSaleStatus(sale.id, e.target.value)} 
                      className="confirm-select">
                      <option value="completada">Confirmado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isRecepcionista ? 10 : 11} className="no-data">No hay ventas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesTable;
