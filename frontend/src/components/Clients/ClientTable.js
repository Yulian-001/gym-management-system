import React from 'react';
import style from './ClientTableStyle.css'




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
    },
    {
      id: 2,
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
    },
    {
      id: 3,
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
    },
    {
      id: 4,
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
    ,{
      id: 5,
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
    },
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
    },
    {
      id: 2,
      Cédula: '112212132',
      Nombre: 'Agustin Rojas',
      Telefono: '3202552456',
      Eps: 'Capital Salud',
      Rh: ' O-',
      Plan: 'Mensualidad',
      Inicio: '2024/05/01',
      vence: '2024/06/03',
      Estado: 'Vencido',
      Dias: '18'
    },
    {
      id: 3,
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
    },
    {
      id: 4,
      Cédula: '112212132',
      Nombre: 'Agustin Rojas',
      Telefono: '3202552456',
      Eps: 'Capital Salud',
      Rh: 'O-',
      Plan: 'Mensualidad',
      Inicio: '2024/05/01',
      vence: '2024/06/03',
      Estado: 'Pendiente',
      Dias: '18'
    }
    ,{
      id: 5,
      Cédula: '112212132',
      Nombre: 'Agustin Rojas',
      Telefono: '3202552456',
      Eps: 'Capital Salud',
      Rh: ' O-',
      Plan: 'Mensualidad',
      Inicio: '2024/05/01',
      vence: '2024/06/03',
      Estado: 'Activo',
      Dias: '18'
    }

  ];
  const getEstadoColor = (Estado) => {
    switch(Estado.toLowerCase()) {
      case 'cancelado': return 'red';
      case 'activo': return '#37e167';
      case 'pendiente': return '#f39d12da';
      case 'vencido': return '#e275bc';
      default: return '#3498db';
    }
  };
  return (
    <div style={{ backgroundColor: 'whiteSmoke',
    borderRadius: '0em 0em 1em 1em',
     padding: '1em',
     margin:'5em 8em 0em 8em' }}>

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

      {/*Botón Añadir cliente */}
      <button className='AddClient' >+  Añadir</button>


    </div>
     

      {/* Barra de búsqueda */}
   <div className='searchClient' >
        <input type='text'
          className='searchC' placeholder='🔍  Buscar cliente...' 
        />
    
      </div>


      
      {/* Tabla */}
      <div className='ContainerTable'>
        <table className='TableScroll'>
          <thead className='theadHeader' >
            <tr>
              <th className='idTable'>id</th>
              <th >Cédula</th>
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
              <tr key={index} className='filaTable' style={{
                borderBottom: '11px solid #fff',
                transition: 'background 0.2s',
              }}>
                <td style={{ width:'5%' }}>{client.id}</td>
                <td style={{ width:'10%' }}>{client.Cédula}</td>
                <td style={{  width:'15%'}}>{client.Nombre}</td>
                <td style={{  width:'10%' }}>{client.Telefono}</td>
                <td style={{  width:'12%' }}>{client.Eps}</td>
                <td style={{  width:'5%' }}>{client.Rh}</td>
                <td style={{  width:'10%' }}>{client.Plan}</td>
                <td style={{ width:'10%'  }}>{client.Inicio}</td>
                <td style={{ width:'10%' }}>{client.vence}</td>
                <td style={{ width:'5%' }}>{client.Dias}</td>
          
                <td style={{width:'8%'}}>
                  <span style={{
                    backgroundColor: getEstadoColor(client.Estado),

                    color: '#f5f7fa',                    
                    padding: '0.2rem 0.3rem',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '550',
                    display:'inline-block'
                  }}>
                    {client.Estado}
                  </span>
                </td>
                <td> <span><td>
                  <button style={{
                    backgroundColor: '#fe5221',
                    color: 'white',
                    border: 'none',
                    padding: '0.45rem 0.66rem',
                    borderRadius: '6px',
                    cursor:'pointer',
                    marginRight:'0.40rem',
                    marginLeft:'0.30rem',
                    fontSize:'12px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#fe5221'}>
                    Eliminar
                  </button>
                </td>
                <td style={{ width:'10%' }} >
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
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}>
                    Editar
                  </button>
                </td>
                </span>
                 {client.Accion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientTable;