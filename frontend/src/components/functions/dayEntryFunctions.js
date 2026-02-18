import React, { useState } from 'react';
import { showModal } from './modalFunctions';

export const DayEntryFormContent = ({ entry, refreshCallback, closeModalFn }) => {
  const [formData, setFormData] = useState(entry || {
    nombre_cliente: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    metodo_pago: 'efectivo',
    estado: 'activa'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre_cliente?.trim()) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }
    if (!formData.fecha) {
      alert('Por favor selecciona una fecha');
      return;
    }
    if (!formData.hora) {
      alert('Por favor selecciona una hora');
      return;
    }

    const dataToSend = {
      nombre_cliente: formData.nombre_cliente.trim(),
      fecha: formData.fecha,
      hora: formData.hora,
      metodo_pago: formData.metodo_pago,
      estado: formData.estado
    };

    try {
      const url = entry?.id
        ? `http://localhost:3001/Api/entrada-dia/${entry.id}`
        : 'http://localhost:3001/Api/entrada-dia';

      const method = entry?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      const result = await response.json();
      console.log('Entrada guardada:', result);

      closeModalFn();
      refreshCallback();
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <div className="form-group">
        <label>Nombre Cliente </label>
        <input
          type="text"
          name="nombre_cliente"
          value={formData.nombre_cliente || ''}
          onChange={handleChange}
          placeholder="Ingresa el nombre"
          required
          style={{
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
        <div className="form-group">
          <label>Fecha </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha || ''}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div className="form-group">
          <label>Hora </label>
          <input
            type="time"
            name="hora"
            value={formData.hora || ''}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
        <div className="form-group">
          <label>Método Pago </label>
          <select
            name="metodo_pago"
            value={formData.metodo_pago || 'efectivo'}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select
            name="estado"
            value={formData.estado || 'activa'}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="activa">Activa</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '25px',
        justifyContent: 'flex-end'
      }}>
        <button 
          type="button" 
          onClick={closeModalFn}
          style={{
            padding: '10px 20px',
            background: '#f1f2f6',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
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
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {entry?.id ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export const handleAddEntry = (refreshCallback) => {
  showModal({
    title: 'Nueva Entrada del Día',
    onClose: () => {},
    content: <DayEntryFormContent entry={null} refreshCallback={refreshCallback} closeModalFn={() => {
      const modal = document.querySelector('[id^="dynamic-modal-"]');
      if (modal && modal.parentNode) {
        document.body.removeChild(modal);
      }
    }} />
  });
};

export const handleEditEntry = (entry, refreshCallback) => {
  showModal({
    title: 'Editar Entrada del Día',
    onClose: () => {},
    content: <DayEntryFormContent entry={entry} refreshCallback={refreshCallback} closeModalFn={() => {
      const modal = document.querySelector('[id^="dynamic-modal-"]');
      if (modal && modal.parentNode) {
        document.body.removeChild(modal);
      }
    }} />
  });
};

export const handleDeleteEntry = async (id, refreshCallback) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
    try {
      const response = await fetch(`http://localhost:3001/Api/entrada-dia/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la entrada');
      }

      console.log('Entrada eliminada');
      refreshCallback();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert(`Error: ${error.message}`);
    }
  }
};
