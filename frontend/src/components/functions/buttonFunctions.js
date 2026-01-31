// src/components/functions/buttonFunctions.js - VERSIÓN SIMPLIFICADA
import React, { useState } from 'react';
import { clientFunctions } from './clientFunctions';
import { showModal, showConfirmModal } from './modalFunctions';

/**
 * Componente de formulario para cliente - MÁS SIMPLE
 */
const ClientForm = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(client || {
    Cédula: '',
    Nombre: '',
    Telefono: '',
    Eps: 'Capital Salud',
    Rh: 'O+',
    Plan: 'Mensualidad',
    Estado: 'Pendiente'
  });

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
          Cédula *
        </label>
        <input
          type="text"
          name="Cédula"
          value={formData.Cédula}
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

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Nombre Completo *
        </label>
        <input
          type="text"
          name="Nombre"
          value={formData.Nombre}
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

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Teléfono *
        </label>
        <input
          type="tel"
          name="Telefono"
          value={formData.Telefono}
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

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          EPS
        </label>
        <select
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
        >
          <option value="Capital Salud">Capital Salud</option>
          <option value="Sura">Sura</option>
          <option value="Nueva EPS">Nueva EPS</option>
          <option value="Sanitas">Sanitas</option>
        </select>
      </div>

      <div style={{ marginBottom:'15px' }}>
        <label style={{ display:'block',marginBottom:'5px', fontWeight:'600'}}>
        Tipo Plan
        </label>
        <select 
        name='plan'
        value={formData.plan}
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
          
          // Mensaje de éxito
          alert('✅ Cliente creado exitosamente!');
        }}
        onCancel={() => {
          console.log('Modal cerrado');
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
        onSubmit={(formData) => {
          // Actualizar cliente
          const updated = clientFunctions.updateClient(client.id, formData);
          if (updated) {
            // Actualizar lista
            const updatedClients = currentClients.map(c => 
              c.id === client.id ? updated : c
            );
            setClients(updatedClients);
            
            alert('✅ Cliente actualizado exitosamente!');
          }
        }}
        onCancel={() => {
          console.log('Edición cancelada');
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
        
        alert('✅ Cliente eliminado exitosamente!');
      } else {
        alert('❌ No se pudo eliminar el cliente');
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