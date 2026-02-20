import React, { useState, useEffect } from 'react';
import { showModal } from './modalFunctions';

// Eventos disponibles con sus precios
const EVENTOS = {
  zumba: { nombre: 'Zumba', precio: 10000 },
  dia: { nombre: 'Día', precio: 8000 },
  aerobicos: { nombre: 'Aeróbicos', precio: 7000 },
  otro: { nombre: 'Otro', precio: null }
};

// Función para obtener el empleado_id del usuario logueado
const obtenerEmpleadoId = async (usuario) => {
  try {
    if (!usuario) return 1;
    
    // Buscar empleado por email o cédula
    const response = await fetch('http://localhost:3001/Api/contabilidad/empleados');
    const result = await response.json();
    
    if (result.success && result.data) {
      const empleados = result.data;
      // Buscar por email o cédula del usuario
      const empleado = empleados.find(e => 
        e.email === usuario.email || 
        e.cedula === usuario.cedula ||
        e.id === usuario.id
      );
      return empleado ? empleado.id : 1;
    }
  } catch (err) {
    console.error('Error obteniendo empleado:', err);
  }
  return 1;
};

export const DayEntryFormContent = ({ entry, refreshCallback, closeModalFn, currentUser }) => {
  // Obtener el usuario del localStorage si no se proporciona
  const user = currentUser || (() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : { id: 1 };
    } catch (e) {
      return { id: 1 };
    }
  })();

  const [empleadoId, setEmpleadoId] = useState(1);

  // Cargar el empleado_id correcto al montar el componente
  useEffect(() => {
    obtenerEmpleadoId(user).then(id => setEmpleadoId(id));
  }, [user]);

  const [formData, setFormData] = useState(entry || {
    nombre_cliente: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    metodo_pago: 'efectivo',
    estado: 'activa',
    evento: '',
    evento_precio_otro: ''
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
      estado: formData.estado,
      evento: formData.evento || null,
      evento_precio: formData.evento === 'otro' ? parseFloat(formData.evento_precio_otro) : (EVENTOS[formData.evento]?.precio || null),
      empleado_id: user?.id || empleadoId || 1
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
      console.log('✅ Entrada guardada:', result);

      // Si hay evento, registrar automáticamente como venta en Contabilidad
      if (dataToSend.evento && dataToSend.evento_precio) {
        console.log('📋 Evento detectado, registrando venta...');
        try {
          const eventoData = EVENTOS[dataToSend.evento];
          const ventaPrecio = parseFloat(dataToSend.evento_precio);
          
          const ventaPayload = {
            cliente_id: null,
            plan_id: null,
            empleado_id: empleadoId || 1,
            fecha_venta: dataToSend.fecha,
            descripcion: eventoData?.nombre || dataToSend.evento.toUpperCase(),
            monto: ventaPrecio,
            metodo_pago: dataToSend.metodo_pago || 'efectivo',
            estado: 'completada',
            evento: dataToSend.evento,
            evento_precio: ventaPrecio
          };

          console.log('📤 Payload final enviado:', ventaPayload);

          const ventaResponse = await fetch('http://localhost:3001/Api/sales', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ventaPayload)
          });

          const ventaText = await ventaResponse.text();
          console.log(`📥 Respuesta (${ventaResponse.status}):`, ventaText);

          if (ventaResponse.ok) {
            try {
              const ventaResult = JSON.parse(ventaText);
              console.log('✅ Venta registrada exitosamente:', ventaResult);
              
              // Disparar evento para listeners en otras partes de la aplicación
              const evento = new CustomEvent('entradaGuardadaConEvento', { 
                detail: { entrada: result, venta: ventaResult }
              });
              window.dispatchEvent(evento);
              console.log('🔔 Evento disparado: entradaGuardadaConEvento');
              
              alert('✅ Entrada y venta registradas correctamente');
            } catch (parseErr) {
              console.error('❌ Error parseando respuesta:', parseErr);
            }
          } else {
            console.error('❌ Error HTTP al registrar venta:', ventaResponse.status, ventaText);
            alert('⚠️ Entrada guardada pero hubo error registrando venta: ' + ventaText);
          }
        } catch (err) {
          console.error('❌ Error en try-catch de venta:', err);
          alert('⚠️ Entrada guardada pero error al registrar venta: ' + err.message);
        }
      }

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

      <div className="form-group" style={{ marginTop: '15px' }}>
        <label>Evento</label>
        <select
          value={formData.evento || ''}
          onChange={(e) => {
            setFormData({
              ...formData,
              evento: e.target.value,
              evento_precio_otro: e.target.value !== 'otro' ? '' : formData.evento_precio_otro
            });
          }}
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
          <option value="">-- Selecciona un evento --</option>
          <option value="zumba">Zumba ($10,000)</option>
          <option value="dia">Día ($8,000)</option>
          <option value="aerobicos">Aeróbicos ($7,000)</option>
          <option value="otro">Otro (precio personalizado)</option>
        </select>
      </div>

      {formData.evento === 'otro' && (
        <div className="form-group" style={{ marginTop: '15px' }}>
          <label>Precio del Evento *</label>
          <input
            type="number"
            value={formData.evento_precio_otro || ''}
            onChange={(e) => setFormData({
              ...formData,
              evento_precio_otro: e.target.value
            })}
            min="0"
            step="100"
            placeholder="Ingresa el precio"
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
      )}

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
