import React, { useEffect, useState } from 'react';
import style from './ClientTableStyle.css'
import {
  handleAddClient,
  handleEditClient,
  handleDeleteClient,
  handleSearch,
} from '../functions/buttonFunctions';
import { clientFunctions } from '../functions/clientFunctions';





function ClientTable() {

  //?Estado para clientes
 const [clients, setClients] = useState([]);
 const [searchTerm, setSearchTerm] = useState('');
  

 //? cargar clientes

 useEffect (() =>{
  const initialClients = clientFunctions.getAllClients();
  setClients(initialClients);
 },[]);


 const handleSearch = () =>{
  if(searchTerm  || searchTerm.trim() === ''){
    //* si esta vacio mostrar todo
    const initialClients = clientFunctions.getAllClients();
      setClients(initialClients);
  }else {
    //? buscar clientes
    const result = clientFunctions.searchClients(searchTerm);
      setClients(result);
  }
 };
 //? busqueda timpo real
  useEffect(() => {
    if(searchTerm.trim() === ''){
      const initialClients = clientFunctions.getAllClients();
        setClients(initialClients);
    } else {
      const results = clientFunctions.searchClients(searchTerm);
        setClients(results);
    }
  }, [searchTerm]);
 
  // Función para obtener color según estado
  const getEstadoColor = (Estado) => {
    switch(Estado?.toLowerCase()) {
      case 'cancelado': return '#ff4757';
      case 'activo': return '#37e167';
      case 'pendiente': return '#f39d12';
      case 'vencido': return '#e275bc';
      default: return '#3498db';
      
    };
  };

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

      {/*Botón Añadir cliente */}
      <button className='AddClient' 
      onClick={() => handleAddClient(setClients,clients)}>+  Añadir</button>


    </div>
     

      {/* Barra de búsqueda */}
   <div className='searchClient' >
        <input type='text'
          className='searchC' placeholder='🔍  Buscar cliente...' 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
    
      </div>
</div>
      
      {/* Tabla */}
      <div className='ContainerTable'>





        <table className='TableScroll'>
                  
          <thead className='theadHeader' >
            <tr >
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
                <td style={{ width:'2%' }}>{client.id}</td>
                <td style={{ width:'5%' }}>{client.Cédula}</td>
                <td style={{  width:'7%'}}>{client.Nombre}</td>
                <td style={{  width:'7%' }}>{client.Telefono}</td>
                <td style={{  width:'7%' }}>{client.Eps}</td>
                <td style={{  width:'2%' }}>{client.Rh}</td>
                <td style={{  width:'5%' }}>{client.Plan}</td>
                <td style={{ width:'10%'  }}>{client.Inicio}</td>
                <td style={{ width:'10%' }}>{client.vence}</td>
                <td style={{ width:'5%' }}>{client.Dias}</td>
          
                <td style={{ width:'5%' }}>
                  <span style={{
                    backgroundColor: getEstadoColor(client.Estado),

                    color: '#f5f7fa',                    
                    padding: '0.2rem 0.3rem',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '550',
                    display:'inline-block'
                  }}
   >
                    {client.Estado}
                  </span>
                </td>

                
                <td > <span><td style={{ width:'5%'}}>
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
                </td>


                <td style={{ width:'10px' }} >
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
                </span> 
                 {client.Accion}
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