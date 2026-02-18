import React, { useState, useEffect } from 'react';
import { showModal } from './modalFunctions';

/**
 * Componente de formulario para ventas
 */
const SalesForm = ({ sale, clients, onSubmit, onCancel }) => {
  const mapSaleToForm = (saleData) => {
    if (!saleData) return {
      cliente_id: '',
      clienteSearch: '',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      cantidad: 1,
      precio_unitario: 0,
      metodo_pago: 'efectivo',
      estado: 'completada'
    };

    // Obtener nombre del cliente para mostrar en búsqueda
    const client = clients.find(c => c.id === saleData.cliente_id);
    return {
      cliente_id: saleData.cliente_id || '',
      clienteSearch: client ? `${client.nombre} (${client.cedula})` : '',
      fecha: saleData.fecha ? new Date(saleData.fecha).toISOString().split('T')[0] : '',
      descripcion: saleData.descripcion || '',
      cantidad: saleData.cantidad || 1,
      precio_unitario: saleData.precio_unitario || 0,
      metodo_pago: saleData.metodo_pago || 'efectivo',
      estado: saleData.estado || 'completada'
    };
  };

  const [formData, setFormData] = useState(mapSaleToForm(sale));
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    setFormData(mapSaleToForm(sale));
  }, [sale, clients]);

  const handleClienteSearch = (valor) => {
    setFormData({
      ...formData,
      clienteSearch: valor,
      cliente_id: ''
    });

    if (valor.trim() === '') {
      setClientesFiltrados([]);
      setMostrarSugerencias(false);
    } else {
      const filtrados = clients.filter(cliente => 
        cliente.nombre.toLowerCase().includes(valor.toLowerCase()) ||
        cliente.cedula.includes(valor)
      );
      setClientesFiltrados(filtrados);
      setMostrarSugerencias(true);
    }
  };

  const seleccionarCliente = (cliente) => {
    setFormData({
      ...formData,
      cliente_id: cliente.id,
      clienteSearch: `${cliente.nombre} (${cliente.cedula})`
    });
    setMostrarSugerencias(false);
    setClientesFiltrados([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: (name === 'cantidad' || name === 'precio_unitario') ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fecha) {
      alert('Por favor ingresa la fecha');
      return;
    }
    if (!formData.descripcion || !formData.descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }
    if (!formData.precio_unitario || formData.precio_unitario <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Cliente
        </label>
        <input
          type="text"
          value={formData.clienteSearch}
          onChange={(e) => handleClienteSearch(e.target.value)}
          onFocus={() => formData.clienteSearch && setMostrarSugerencias(true)}
          placeholder="Busca por nombre o cédula "
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />

        {mostrarSugerencias && clientesFiltrados.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 10,
            marginTop: '-1px'
          }}>
            {clientesFiltrados.map(cliente => (
              <div
                key={cliente.id}
                onClick={() => seleccionarCliente(cliente)}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                <strong>{cliente.nombre}</strong> - {cliente.cedula}
              </div>
            ))}
          </div>
        )}

        {mostrarSugerencias && clientesFiltrados.length === 0 && formData.clienteSearch && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            padding: '10px',
            color: '#999',
            fontSize: '14px',
            zIndex: 10,
            marginTop: '-1px'
          }}>
            No se encontraron clientes
          </div>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Fecha (Hoy por defecto)
        </label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <small style={{ color: '#999', marginTop: '3px', display: 'block' }}>
          La fecha de hoy está preseleccionada. Modifica si es necesario.
        </small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Descripción 
        </label>
        <input
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Ej: Proteína Whey, Accesorio fitness"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Cantidad 
          </label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="1"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Precio Unitario *
          </label>
          <input
            type="number"
            name="precio_unitario"
            value={formData.precio_unitario || ''}
            onChange={handleChange}
            onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
            min="0"
            step="0.01"
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Método Pago
          </label>
          <select
            name="metodo_pago"
            value={formData.metodo_pago}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="completada">Completada</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', justifyContent: 'flex-end', marginTop: '20px' }}>
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
            marginTop: '2rem'
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
            marginTop: '2rem'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#38eda8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#27cf8e'}
        >
          {sale ? 'Actualizar' : 'Crear'} Venta
        </button>
      </div>
    </form>
  );
};

/**
 * Función para manejar agregar venta
 */
export const handleAddSale = (refreshCallback, clients) => {
  showModal({
    title: 'Nueva Venta',
    content: (
      <SalesForm
        clients={clients}
        onSubmit={async (formData) => {
          try {
            const dataToSend = {
              cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
              plan_id: formData.plan_id ? parseInt(formData.plan_id) : null,
              empleado_id: 1, // Temporal - será el usuario logueado
              fecha_venta: formData.fecha,
              descripcion: formData.descripcion.trim(),
              cantidad: parseInt(formData.cantidad),
              precio_unitario: parseFloat(formData.precio_unitario),
              metodo_pago: formData.metodo_pago,
              estado: formData.estado
            };

            console.log('Datos a enviar:', dataToSend);

            const response = await fetch('http://localhost:3001/Api/sales', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToSend)
            });

            console.log('Status respuesta:', response.status);

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error respuesta:', errorText);
              throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const newSale = await response.json();
            console.log('Venta creada:', newSale);

            // Cerrar modal
            const modal = document.querySelector('[id^="dynamic-modal-"]');
            if (modal) modal.remove();

            alert('Venta creada exitosamente!');
            try {
              window.dispatchEvent(new CustomEvent('saleCreated', { detail: newSale }));
            } catch (e) {
              console.warn('No se pudo emitir evento saleCreated:', e);
            }
            refreshCallback();
          } catch (error) {
            console.error('Error completo:', error);
            alert('Error al crear venta: ' + error.message);
          }
        }}
        onCancel={() => {
          const modal = document.querySelector('[id^="dynamic-modal-"]');
          if (modal) modal.remove();
        }}
      />
    )
  });
};

/**
 * Vender un plan: abre modal con formulario prellenado para el plan seleccionado
 */
export const handleSellPlan = (plan, refreshCallback, clients) => {
  showModal({
    title: `Vender plan: ${plan.name}`,
    content: (
      <SalesForm
        sale={{
          cliente_id: '',
          clienteSearch: '',
          fecha: new Date().toISOString().split('T')[0],
          descripcion: plan.name,
          cantidad: 1,
          precio_unitario: parseFloat(plan.price),
          metodo_pago: 'efectivo',
          estado: 'completada',
          plan_id: plan.id
        }}
        clients={clients}
        onSubmit={async (formData) => {
          try {
            const dataToSend = {
              cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
              plan_id: plan.id,
              empleado_id: 1,
              fecha_venta: formData.fecha,
              descripcion: formData.descripcion.trim(),
              cantidad: parseInt(formData.cantidad),
              precio_unitario: parseFloat(formData.precio_unitario),
              metodo_pago: formData.metodo_pago,
              estado: formData.estado
            };

            const response = await fetch('http://localhost:3001/Api/sales', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
              const text = await response.text();
              throw new Error(text || `Error ${response.status}`);
            }

            const newSale = await response.json();
            alert('Venta de plan registrada correctamente');
            // Cerrar modal dinámico
            const modal = document.querySelector('[id^="dynamic-modal-"]');
            if (modal) modal.remove();
            if (refreshCallback) refreshCallback();
            try {
              window.dispatchEvent(new CustomEvent('saleCreated', { detail: newSale }));
            } catch (e) {
              console.warn('No se pudo emitir evento saleCreated:', e);
            }
          } catch (err) {
            console.error('Error al vender plan:', err);
            alert('Error al registrar la venta: ' + err.message);
          }
        }}
        onCancel={() => {
          const modal = document.querySelector('[id^="dynamic-modal-"]');
          if (modal) modal.remove();
        }}
      />
    )
  });
};

/**
 * Función para manejar editar venta
 */
export const handleEditSale = (sale, refreshCallback, clients) => {
  if (!sale || !sale.id) {
    console.error('Venta inválida para editar');
    return;
  }

  showModal({
    title: 'Editar Venta',
    content: (
      <SalesForm
        sale={sale}
        clients={clients}
        onSubmit={async (formData) => {
          try {
            const dataToSend = {
              cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
              fecha: formData.fecha,
              descripcion: formData.descripcion.trim(),
              cantidad: parseInt(formData.cantidad),
              precio_unitario: parseFloat(formData.precio_unitario),
              metodo_pago: formData.metodo_pago,
              estado: formData.estado
            };

            const response = await fetch(`http://localhost:3001/Api/sales/${sale.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
              throw new Error(`Error ${response.status}`);
            }

            // Cerrar modal
            const modal = document.querySelector('[id^="dynamic-modal-"]');
            if (modal) modal.remove();

            alert('Venta actualizada exitosamente!');
            refreshCallback();
          } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar venta: ' + error.message);
          }
        }}
        onCancel={() => {
          const modal = document.querySelector('[id^="dynamic-modal-"]');
          if (modal) modal.remove();
        }}
      />
    )
  });
};

/**
 * Función para manejar eliminar venta
 */
export const handleDeleteSale = async (saleId, refreshCallback) => {
  if (!saleId) {
    console.error('ID de venta inválido');
    return;
  }

  if (window.confirm('¿Está seguro de que desea eliminar esta venta?')) {
    try {
      const response = await fetch(`http://localhost:3001/Api/sales/${saleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      alert('Venta eliminada exitosamente!');
      refreshCallback();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar venta: ' + error.message);
    }
  }
};

export default SalesForm;
