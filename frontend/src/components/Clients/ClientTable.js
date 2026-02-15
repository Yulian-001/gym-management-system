import React, { useEffect, useState } from 'react';
import  './ClientTableStyle.css'
import {
  handleAddClient,
  handleEditClient,
  handleDeleteClient,
} from '../functions/buttonFunctions';

function ClientTable() {

  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar clientes de la API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/Api/clients');
        if (!response.ok) throw new Error('Error al cargar clientes');
        const data = await response.json();
        setAllClients(data);
        setClients(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);

  // Búsqueda en tiempo real
  useEffect(() => {
    if(searchTerm.trim() === ''){
      setClients(allClients);
    } else {
      const results = allClients.filter(client => 
        client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cedula?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setClients(results);
    }
  }, [searchTerm, allClients]);

  // Función para obtener nombre del plan por ID
  const getPlanName = (planId) => {
    const plans = {
      1: 'Mensualidad',
      2: 'Trimestral',
      3: 'Semestral',
      4: 'Anual',
      5: 'Acceso Día'
    };
    return plans[planId] || 'N/A';
  };

  // Función para calcular días
  const calculateDays = (inicio, vence) => {
    if (!vence) return 'N/A';
    const start = new Date(inicio);
    const end = new Date(vence);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO');
  };
 
  // Función para obtener color según estado
  const getEstadoColor = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'cancelado': return '#ff4757';
      case 'activo': return '#37e167';
      case 'pendiente': return '#f39d12';
      case 'vencido': return '#e275bc';
      case 'suspendido': return '#f39d12';
      default: return '#3498db';
    };
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando clientes...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div className='head-container' style={{ 
      borderRadius: '0em 0em 1em 1em',
      padding: '0.4rem',
    }}>

      <div className='header-button'>
        <div className='headBorder'>
          <h2 className='TableTitle' style={{
            fontSize: '1.4rem',
            margin: '0em 1em 0em 0em',
            fontWeight: '600',
            display:'inline',
            whiteSpace:'nowrap',
            color: '#2683ff',
            paddingRight:'2em',
          }}>Gestión de Clientes</h2>

          <button className='AddClient' 
            onClick={() => handleAddClient(setClients,clients)}>+  Añadir
          </button>
        </div>
       
        <div className='searchClient'>
          <input type='text'
            className='searchC' 
            placeholder='🔍  Buscar cliente...' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className='ContainerTable'>
        <table className='TableScroll'>
          <thead className='theadHeader'>
            <tr>
              <th className='idTable'>id</th>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>EPS</th>
              <th>RH</th>
              <th>Plan</th>
              <th>Inicio</th>
              <th>Vence</th>
              <th>Días</th>
              <th>Estado</th>
              <th className='accionTable'>Acción</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? clients.map((client) => (
              <tr key={client.id} className='filaTable' style={{
                borderBottom: '11px solid #fff',
                transition: 'background 0.2s',
              }}>
                <td style={{ width:'2%' }}>{client.id}</td>
                <td style={{ width:'8%' }}>{client.cedula}</td>
                <td style={{ width:'9%' }}>{client.nombre}</td>
                <td style={{ width:'9%' }}>{client.telefono || '-'}</td>
                <td style={{ width:'8%' }}>{client.eps || '-'}</td>
                <td style={{ width:'3%' }}>{client.rh}</td>
                <td style={{ width:'6%' }}>{getPlanName(client.plan_id)}</td>
                <td style={{ width:'10%' }}>{formatDate(client.inicio)}</td>
                <td style={{ width:'10%' }}>{formatDate(client.vence)}</td>
                <td style={{ width:'4%' }}>{calculateDays(client.inicio, client.vence)}</td>
                <td style={{ width:'6%' }}>
                  <span style={{
                    backgroundColor: getEstadoColor(client.estado),
                    color: '#f5f7fa',                    
                    padding: '0.2rem 0.3rem',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '550',
                    display:'inline-block'
                  }}>
                    {client.estado}
                  </span>
                </td>
                <td style={{ width:'16%', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <button style={{ 
                    backgroundColor:'#d72727',
                    color: 'white',
                    border: 'none',
                    padding: '0.45rem 0.66rem',
                    borderRadius: '6px',
                    cursor:'pointer',
                    fontSize:'12px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#d72727'}
                  onClick={() => handleDeleteClient(client.id, setClients, clients)}>
                    Eliminar
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
                  onClick={() => handleEditClient(client, setClients, clients)}>
                    Editar
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay clientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ClientTable;