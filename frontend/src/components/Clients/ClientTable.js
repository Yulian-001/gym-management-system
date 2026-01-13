import React from 'react';
import style from './ClientTable'




function ClientTable() {
  const clients = [
    {
      id: 1,
      Cédula: '112212132',
      Nombre: 'Agustin Rojas',
      Telefono: '3202552456',
      Eps: 'Capital Salud',
      Rh: ' O-',
      Plan: 'Mensualidad',
      Inicio: '2024/05/01',
      vence: '2024/06/03',
      Estado: 'Cancelado',
      Dias: '18'
    }
  ];
  const getEstadoColor = (Estado) => {
    switch(Estado.toLowerCase()) {
      case 'Cancelado': return 'red';
      case 'Activo': return '#0ae08d';
      case 'Pendiente': return '#f39c12';
      case 'Vencido': return '#95a5a6';
      default: return '#3498db';
    }
  };
  return (
    <div style={{ backgroundColor: 'whiteSmoke',
    borderRadius: '0em 0em 1em 1em',
     padding: '1em',
     margin:'5em 8em 0em 8em' }}>
      <h2 className='TableTitle' style={{
        fontSize: '20px',

        margin: '0px 90px 30x 0px',
        fontWeight: '600',
        marginBottom: '25px',

        color: '#2c3e50',
        paddingBottom: '10px'
      }}>Gestión de Clientes</h2>
      
      {/* Barra de búsqueda */}
   <div className='searchClient' >
        <input type='text'  className='searchC' placeholder='🔍  Buscar cliente...' 
        style={{ backgroundColor:'whitesmoke',
        border:'1px solid grey',
        margin:'0vh 0vh 3vh 8vh', 
        fontSize:'15px', 
        fontFamily:'system-ui',
         borderRadius:'23px'}} />
    
      </div>


      
      {/* Tabla */}
      <div>
        <table>
          <thead className='theadTitle'>
            <tr className='theadTitle'>
              <th className='idTable'>id</th>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Telefono</th>
              <th>Eps</th>
              <th>Rh</th>
              <th>Plan</th>
              <th>Inicio</th>
              <th>Vence</th>
              <th>Días</th>
              <th>Estado</th>
              <th className='accionTable'>Accion</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index} style={{
                borderBottom: '1px solid #eee',
                transition: 'background 0.2s'
              }}>
                <td style={{ padding: '12px 15px' }}>{client.id}</td>
                <td style={{ padding: '12px 15px' }}>{client.Cédula}</td>
                <td style={{ padding: '12px 15px' }}>{client.Nombre}</td>
                <td style={{ padding: '12px 15px' }}>{client.Telefono}</td>
                <td style={{ padding: '12px 15px' }}>{client.Eps}</td>
                <td style={{ padding: '12px 15px' }}>{client.Rh}</td>
                <td style={{ padding: '12px 15px' }}>{client.Plan}</td>
                <td style={{ padding: '12px 15px' }}>{client.Inicio}</td>
                <td style={{ padding: '12px 15px' }}>{client.vence}</td>
                <td style={{ padding: '12px 15px' }}>{client.Dias}</td>
          
                <td style={{ padding: '2px 1px' }}>
                  <span style={{
                    backgroundColor: getEstadoColor(client.Estado),
                    marginBottom:'23px',
                    color: '#f5f7fa',                    
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '15px',
                    fontWeight: '550'
                  }}>
                    {client.Estado}
                  </span>
                </td>
                <td style={{ padding: '12px 11px' }}>
                  <button style={{
                    backgroundColor: '#fe5221',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor:'pointer',
                    fontSize:'12px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#fe5221'}>
                    Eliminar
                  </button>
                </td>
                <td style={{ padding: '12px 15px' }}>
                  <button style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'background-color 0.3s' 
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2750F5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientTable;