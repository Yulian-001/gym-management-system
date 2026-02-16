// src/components/functions/buttonFunctions.js - VERSIÓN SIMPLIFICADA
import React, {  useEffect, useState } from 'react';
import { clientFunctions } from './clientFunctions';
import { showModal, showConfirmModal } from './modalFunctions';

/**
 * Componente de formulario para cliente - MÁS SIMPLE
 */
const ClientForm = ({ client, onSubmit, onCancel }) => {
 const mapClientToForm = (clientData) => {
  if(!clientData) return {
      cedula: '',
      nombre: '',
      telefono: '',
      eps: 'Capital Salud',
      rh: 'O+',
      plan_id: '1',
      inicio: '',
      vence: '',
      estado: 'pendiente'
  };

   // Mapear según la estructura de tu API/DB
    return {
      Cédula: clientData.cedula || clientData.Cédula || '',
      Nombre: clientData.nombre || clientData.Nombre || '',
      Telefono: clientData.telefono || clientData.Telefono || '',
      Email: clientData.email || clientData.Email || '',
      Eps: clientData.eps || clientData.Eps || 'Capital Salud',
      Rh: clientData.rh || clientData.Rh || 'O+',
      plan_id: clientData.plan_id || clientData.Plan_id || '1',
      Inicio: clientData.inicio ? new Date(clientData.inicio).toISOString().split('T')[0] : '',
      Vence: clientData.vence ? new Date(clientData.vence).toISOString().split('T')[0] : '',
      stado: clientData.estado || clientData.Estado || 'pendiente'
    };
  };

  const [formData, setFormData] = useState(mapClientToForm(client));
  useEffect(() => {
    setFormData(mapClientToForm(client));
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.Cédula || !formData.Nombre || !formData.Telefono) {
      alert('Por favor complete todos los campos obligatorios (*)');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Cédula 
        </label>
        <input
          type="text"
          name="Cédula"
          value={formData.Cédula}
          onChange={handleChange}
          
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
          {/*  === Editar: Nombre  ===*/}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Nombre Completo 
        </label>
        <input
          type="text"
          name="Nombre"
          value={formData.Nombre}
          onChange={handleChange}
          
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
          
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Teléfono 
        </label>
        <input
          type="tel"
          name="Telefono"
          value={formData.Telefono}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
         
     <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          EPS
        </label>
        <input
          type="text"
          name="Eps"
          value={formData.Eps}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
           
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Rh
        </label>
        <input
          type="text"
          name="Rh"
          value={formData.Rh}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

           
        <div style={{ marginBottom:'15px' }}>
        <label style={{ display:'block',marginBottom:'5px', fontWeight:'600'}}>
        Tipo Plan
        </label>
        <select 
        name='Plan'
        value={formData.Plan}
        onChange={handleChange}
        style={{
           width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
        }}>
          <option value="Mensualidad">Mensualidad</option>
          <option value="Ticketera">Ticketera</option>
          <option value="Día">Día</option>
        </select>
      </div>

       
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Inicio plan
        </label>
        <input
          type="date"
          name="Inicio"
          value={formData.Inicio}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

            <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Fin plan
        </label>
        <input
          type="date"
          name="Fin"
          value={formData.Vence}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '40px',justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            background: '#e5e8f3',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop:'2rem'
          }}
           onMouseEnter={(e) => e.target.style.backgroundColor = '#d4d6dd'}
           onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e8f3'}

        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#27cf8e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop:'2rem',
            transition:' easy  4s'
          }}
           onMouseEnter={(e) => e.target.style.backgroundColor = '#27cf8e'}
           onMouseLeave={(e) => e.target.style.backgroundColor = '#38eda8'}
        >
          {client ? 'Actualizar' : 'Crear Cliente'}
        </button>
      </div>
    </form>
  );
};

/**
 * Función para manejar el botón "Añadir Cliente"
 */
export const handleAddClient = (setClients, currentClients) => {
  showModal({
    title: 'Añadir Nuevo Cliente',
    content: (
      <ClientForm
        onSubmit={(formData) => {
          // Crear cliente
          const newClient = clientFunctions.createClient(formData);
          
          // Actualizar estado
          setClients([...currentClients, newClient]);
          
          //* cerrar modal
          const modal = document.querySelector('[id^="dynamic-modal-"]');
          if(modal) modal.remove();
          alert('Cliente creado exitosamente!');
        }}
        onCancel={() => {
          const modal = document.querySelector('[id^="dynamic-modal-"]');
          if(modal){
            modal.remove();
          }
        }}
      />
    )
  });
};

/**
 * Función para manejar el botón "Editar Cliente"
 */
export const handleEditClient = (client, setClients, currentClients) => {
  if (!client || !client.id) {
    console.error('Cliente inválido para editar');
    return;
  }
  
  showModal({
    title: 'Editar Cliente',
    content: (
      <ClientForm
        client={client}
        onSubmit={async (formData) => {
          try {
            // Mapear datos del formulario a la estructura de la API
            const dataToSend = {
              cedula: formData.Cédula || formData.cedula,
              nombre: formData.Nombre || formData.nombre,
              email: formData.Email || formData.email || '',
              telefono: formData.Telefono || formData.telefono,
              eps: formData.Eps || formData.eps,
              rh: formData.Rh || formData.rh,
              plan_id: formData.plan_id || formData.Plan_id,
              vence: formData.Vence || formData.vence,
              inicio: formData.Inicio || formData.inicio,
              estado: formData.Estado || formData.estado || formData.stado
            };

            // Hacer llamada a la API para actualizar
            const response = await fetch(`http://localhost:3001/Api/clients/${client.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
              throw new Error('Error al actualizar cliente en la API');
            }

            const updated = await response.json();
            
            // Actualizar la lista con los datos retornados por la API
            const updatedClients = currentClients.map(c => 
              c.id === client.id ? updated : c);
            setClients(updatedClients);
            
            // Cerrar modal
            const modal = document.querySelector('[id^="dynamic-modal-"]');
            if(modal) modal.remove();
            
            alert('Cliente actualizado exitosamente!');
          } catch (error) {
            console.error('Error actualizando cliente:', error);
            alert('Error al actualizar cliente: ' + error.message);
          }
        }}
        onCancel={() => {
         const modal = document.querySelector('[id^="dynamic-modal-"]');
         if(modal){
          modal.remove();
         }
        }}
      />
    )
  });
};

/**
 * Función para manejar el botón "Eliminar Cliente"
 */
export const handleDeleteClient = (clientId, setClients, currentClients) => {
  if (!clientId) {
    console.error('ID de cliente inválido');
    return;
  }
  
  showConfirmModal({
    message: '¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.',
    onConfirm: () => {
      // Eliminar cliente
      const deleted = clientFunctions.deleteClient(clientId);
      if (deleted) {
        // Actualizar lista
        const updatedClients = currentClients.filter(c => c.id !== clientId);
        setClients(updatedClients);
        
        alert(' Cliente eliminado exitosamente!');
      } else {
        alert(' No se pudo eliminar el cliente');
      }
    },
    onCancel: () => {
      console.log('Eliminación cancelada');
    }
  });
};

/**
 * Función para manejar la búsqueda
 */
export const handleSearch = (searchTerm, setClients) => {
  if (!searchTerm || searchTerm.trim() === '') {
    // Si no hay término, mostrar todos
    setClients(clientFunctions.getAllClients());
  } else {
    // Buscar clientes
    const results = clientFunctions.searchClients(searchTerm);
    setClients(results);
  }
};