import React, { useEffect, useState } from 'react';
import './SalesStyle.css';
import { handleAddSale, 
    handleEditSale,
     handleDeleteSale,
    } from '../functions/salesFunctions';
import { EditIcon,TrashIcon } from '../../icons';

function SalesTable() {
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch('http://localhost:3001/Api/sales');
        if (!response.ok) throw new Error('Error al cargar ventas');
        const data = await response.json();
        setAllSales(data);
        setSales(data);
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
      const response = await fetch('http://localhost:3001/Api/sales');
      if (response.ok) {
        const data = await response.json();
        setAllSales(data);
        setSales(data);
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
          onClick={() => handleAddSale(refreshSales, clients)}
        >
          + Nueva Venta
        </button>
      </div>

      <div className="sales-table-wrapper">
        <table className="sales-table" >
          <thead>
            <tr style={{ textTransform:'capitalize'}}>
              <th style={{ width:'5%'}}>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Total</th>
              <th style={{ width:'14%'}}>Método Pago</th>
              <th style={{ width:'16%'}}>Estado</th>
              <th >Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{getClientName(sale.cliente_id)}</td>
                  <td>{new Date(sale.fecha).toLocaleDateString()}</td>
                  <td>{sale.descripcion}</td>
                  <td>{sale.cantidad}</td>
                  <td>${parseFloat(sale.precio_unitario).toFixed(2)}</td>
                  <td>${parseFloat(sale.total).toFixed(2)}</td>
                  <td>{sale.metodo_pago}</td>
                  <td className={`estado-${sale.estado}`}>{sale.estado}</td>
                  <td className="sales-actions" style={{ width:'16%', display: 'flex', gap: '6px', justifyContent: 'center',textAlign:'center'}}>
                    <button style={{ 

                      backgroundColor:'#d72727',
                      color: 'white',
                      border: 'none',
                      padding: '0.45rem 0.66rem',
                      borderRadius: '6px',
                      cursor:'pointer',
                      fontSize:'12px',
                      transition: 'background-color 0.3s',
                      marginRight:'0.7rem',
                      marginLeft:' 3rem',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#d72727'}
                    onClick={() => handleDeleteSale(sale.id, refreshSales)}>
                      <TrashIcon size={18} />
                    </button>

                    <button style={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding:'0.45rem 0.66rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'background-color 0.3s' 
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2750F5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                    onClick={() => handleEditSale(sale, refreshSales, clients)}>
                      <EditIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data">No hay ventas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesTable;
