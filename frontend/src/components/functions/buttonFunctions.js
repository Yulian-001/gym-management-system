// src/components/functions/buttonFunctions.js - VERSIÓN SIMPLIFICADA
import React, {  useEffect, useState } from 'react';
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
    email: '',
    eps: 'Capital Salud',
    rh: 'O+',
    plan_id: '',
    inicio: '',
    vence: '',
    estado: 'activo'
  };

   // Mapear según la estructura de tu API/DB
    return {
      cedula: clientData.cedula || clientData.Cédula || '',
      nombre: clientData.nombre || clientData.Nombre || '',
      telefono: clientData.telefono || clientData.Telefono || '',
      email: clientData.email || clientData.Email || '',
      eps: clientData.eps || clientData.Eps || 'Capital Salud',
      rh: clientData.rh || clientData.Rh || 'O+',
      plan_id: clientData.plan_id || clientData.Plan_id || '1',
      inicio: clientData.inicio ? new Date(clientData.inicio).toISOString().split('T')[0] : '',
      vence: clientData.vence ? new Date(clientData.vence).toISOString().split('T')[0] : '',
      estado: clientData.estado || clientData.Estado || 'activo'
    };
  };

  const [formData, setFormData] = useState(mapClientToForm(client));
  const [availablePlans, setAvailablePlans] = useState([]);

  useEffect(() => {
    // Cargar planes para mostrar en el select (y precios)
    const fetchPlans = async () => {
      try {
        const res = await fetch('http://localhost:3001/Api/plans');
        if (!res.ok) return;
        const list = await res.json();
        setAvailablePlans(list);
        // Si no hay plan seleccionado, preseleccionar el primero
        setFormData(prev => ({ ...prev, plan_id: prev.plan_id || (list[0] ? String(list[0].id) : '') }));
      } catch (e) {
        console.error('No se pudieron cargar planes:', e);
      }
    };
    fetchPlans();
  }, []);
  // Helper: sumar días a una fecha YYYY-MM-DD
  const addDays = (dateStr, days) => {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + parseInt(days, 10));
      return d.toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  };

  // Al cambiar el plan seleccionado, rellenar inicio y vence según duration_days
  useEffect(() => {
    const planId = formData.plan_id;
    if (!planId) return;
    const plan = availablePlans.find(p => String(p.id) === String(planId));
    if (!plan) return;
    const duration = plan.duration_days || plan.duration || null;
    // Si tenemos duración numérica, autocompletar inicio = hoy y vence = hoy + duration
    if (isFinite(parseInt(duration))) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => {
        // Sólo sobreescribir inicio si está vacío o si fue previamente igual a today (evitar sobreescribir inicio elegido manualmente)
        const shouldSetInicio = !prev.inicio || prev.inicio === today;
        const inicioVal = shouldSetInicio ? today : prev.inicio;
        const venceVal = addDays(inicioVal, parseInt(duration, 10));
        return { ...prev, inicio: inicioVal, vence: venceVal };
      });
    }
  }, [formData.plan_id, availablePlans]);
  useEffect(() => {
    setFormData(mapClientToForm(client));
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el usuario modifica la fecha de inicio y el plan tiene duración, recalcular vence
    if (name === 'inicio') {
      const planId = formData.plan_id;
      const plan = availablePlans.find(p => String(p.id) === String(planId));
      const duration = plan ? (plan.duration_days || plan.duration) : null;
      if (isFinite(parseInt(duration))) {
        const newVence = addDays(value, parseInt(duration, 10));
        setFormData({ ...formData, inicio: value, vence: newVence });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.cedula || !formData.nombre || !formData.telefono) {
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
          name="cedula"
          value={formData.cedula}
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
          name="nombre"
          value={formData.nombre}
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
          name="telefono"
          value={formData.telefono}
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
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
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
          name="eps"
          value={formData.eps}
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
          RH
        </label>
        <input
          type="text"
          name="rh"
          value={formData.rh}
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
          name='plan_id'
          value={formData.plan_id}
          onChange={handleChange}
          style={{
             width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
          }}>
            <option value="">-- Selecciona un plan --</option>
            {availablePlans
              .filter(p => {
                if (!p || !p.name) return true;
                const nameNorm = p.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                return nameNorm !== 'dia' && nameNorm !== 'día';
              })
              .map(p => (
                <option key={p.id} value={String(p.id)}>{`${p.name} - $${parseFloat(p.price || 0).toLocaleString('es-CO')}`}</option>
              ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Precio del Plan (seleccionado)
          </label>
          <input
            type="text"
            readOnly
            value={(() => {
              const p = availablePlans.find(x => String(x.id) === String(formData.plan_id));
              return p ? `$${parseFloat(p.price || 0).toLocaleString('es-CO')}` : '-';
            })()}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              background: '#f6f7fb'
            }}
          />
        </div>

       
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Inicio plan
        </label>
        <input
          type="date"
          name="inicio"
          value={formData.inicio}
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
          name="vence"
          value={formData.vence}
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
          Estado
        </label>
        <select 
          name='estado'
          value={formData.estado}
          onChange={handleChange}
          style={{
             width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
          }}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="cancelado">Cancelado</option>
          <option value="vencido">Vencido</option>
          <option value="suspendido">Suspendido</option>
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
export const handleAddClient = (setClients, currentClients, user) => {
  showModal({
    title: 'Añadir Nuevo Cliente',
    content: (
      <ClientForm
        onSubmit={async (formData) => {
          try {
            //? Función auxiliar para convertir fecha correctamente
            const formatDate = (dateString) => {
              if (!dateString) return null;
              
              //? Si ya está en formato YYYY-MM-DD, devolverlo así
              if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
              }
              
              //? Intentar parsear la fecha
              try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                  console.warn('Fecha inválida:', dateString);
                  return null;
                }
                return date.toISOString().split('T')[0];
              } catch (e) {
                console.error('Error al parsear fecha:', dateString, e);
                return null;
              }
            };

            //? Validar campos obligatorios
            if (!formData.cedula || !formData.cedula.trim()) {
              alert('La cédula es obligatoria');
              return;
            }
            if (!formData.nombre || !formData.nombre.trim()) {
              alert('El nombre es obligatorio');
              return;
            }
            if (!formData.telefono || !formData.telefono.trim()) {
              alert('El teléfono es obligatorio');
              return;
            }

            //? Mapear datos del formulario para enviar a la API
            const dataToSend = {
              cedula: formData.cedula.trim(),
              nombre: formData.nombre.trim(),
              email: (formData.email || '').trim(),
              telefono: formData.telefono.trim(),
              eps: formData.eps || 'Capital Salud',
              rh: formData.rh || 'O+',
              plan_id: parseInt(formData.plan_id) || 1,
              vence: formatDate(formData.vence),
              inicio: formatDate(formData.inicio),
              estado: formData.estado || 'activo'
            };

            //? Hacer llamada POST a la API para crear cliente
            const response = await fetch('http://localhost:3001/Api/clients', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
              const error = await response.text();
              console.error('Error response:', error);
              
              // Detectar error de cédula duplicada
              if (response.status === 409) {
                try {
                  const errorObj = JSON.parse(error);
                  if (errorObj.code === 'CEDULA_DUPLICATE') {
                    alert('⚠️ La cédula ya está registrada en el sistema');
                    return;
                  }
                } catch (e) {}
              }
              
              throw new Error(`Error ${response.status}: ${error}`);
            }

            const newClient = await response.json();
            
            //? Actualizar la lista con el nuevo cliente retornado por la API
            setClients([...currentClients, newClient]);
            
            //? Cerrar modal
            const modal = document.querySelector('[id^="dynamic-modal-"]');
            if(modal) modal.remove();
            
            alert('Cliente creado exitosamente!');
            //? Si se seleccionó un plan, preguntar si registrar la venta ahora
            try {
              const planId = parseInt(dataToSend.plan_id);
              if (planId) {
                //? Registrar la venta automáticamente usando el precio del plan cuando esté disponible.
                let planPrice = null;
                try {
                  const plansRes = await fetch('http://localhost:3001/Api/plans');
                  if (plansRes.ok) {
                    const plansList = await plansRes.json();
                    const found = plansList.find(p => p.id === planId);
                    if (found) planPrice = parseFloat(found.price);
                  }
                } catch (e) {
                  console.error('No se pudo obtener precio del plan:', e);
                }

                const monto = (isFinite(planPrice) ? planPrice : parseFloat(window.prompt('Ingrese monto de la venta del plan:', '0.00'))) || 0;
                if (monto > 0) {
                  const saleBody = {
                    cliente_id: newClient.id,
                    plan_id: planId,
                    empleado_id: user?.id || 1,
                    fecha_venta: new Date().toISOString().split('T')[0],
                    descripcion: `Compra plan ${planId}`,
                    cantidad: 1,
                    precio_unitario: monto,
                    monto: monto,
                    metodo_pago: 'efectivo',
                    estado: 'completada',
                    evento: null,
                    evento_precio: null
                  };

                  try {
                    const saleResp = await fetch('http://localhost:3001/Api/sales', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(saleBody)
                    });

                    if (!saleResp.ok) {
                      const txt = await saleResp.text();
                      console.error('Error creando venta al registrar cliente:', txt);
                      alert('No se pudo registrar la venta del plan: ' + txt);
                    } else {
                      const created = await saleResp.json();
                      alert('Venta del plan registrada correctamente');
                      try {
                        window.dispatchEvent(new CustomEvent('saleCreated', { detail: created }));
                      } catch (e) {
                        console.warn('No se pudo emitir evento saleCreated:', e);
                      }
                    }
                  } catch (e) {
                    console.error('Error creando venta al registrar cliente:', e);
                    alert('No se pudo registrar la venta del plan: ' + e.message);
                  }
                } else {
                  alert('Monto inválido; no se registró la venta del plan');
                }
              }
            } catch (e) {
              console.error('Error en flujo de venta tras crear cliente:', e);
            }
          } catch (error) {
            console.error('Error completo:', error);
            alert('Error al crear cliente: ' + error.message);
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
 *? Función para manejar el botón "Editar Cliente"
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
            //? Función auxiliar para convertir fecha correctamente
            const formatDate = (dateString) => {
              if (!dateString) return null;
              
              if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
              }
              
              try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                  console.warn('Fecha inválida:', dateString);
                  return null;
                }
                return date.toISOString().split('T')[0];
              } catch (e) {
                console.error('Error al parsear fecha:', dateString, e);
                return null;
              }
            };

            //? Validar campos obligatorios
            if (!formData.cedula || !formData.cedula.trim()) {
              alert('La cédula es obligatoria');
              return;
            }
            if (!formData.nombre || !formData.nombre.trim()) {
              alert('El nombre es obligatorio');
              return;
            }
            if (!formData.telefono || !formData.telefono.trim()) {
              alert('El teléfono es obligatorio');
              return;
            }

            //? Los datos ya vienen correctamente mapeados del formulario
            const dataToSend = {
              cedula: formData.cedula.trim(),
              nombre: formData.nombre.trim(),
              email: (formData.email || '').trim(),
              telefono: formData.telefono.trim(),
              eps: formData.eps || 'Capital Salud',
              rh: formData.rh || 'O+',
              plan_id: parseInt(formData.plan_id) || 1,
              vence: formatDate(formData.vence),
              inicio: formatDate(formData.inicio),
              estado: formData.estado || 'activo'
            };

            console.log('Actualizando cliente con datos:', dataToSend);

            //? Hacer llamada a la API para actualizar
            const response = await fetch(`http://localhost:3001/Api/clients/${client.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
              const error = await response.text();
              console.error('Error response:', error);
              throw new Error(`Error ${response.status}: ${error}`);
            }

            const updated = await response.json();
            
            //? Actualizar la lista con los datos retornados por la API
            const updatedClients = currentClients.map(c => 
              c.id === client.id ? updated : c);
            setClients(updatedClients);
            
            //? Cerrar modal
            const modal = document.querySelector('[id^="dynamic-modal-"]');
            if(modal) modal.remove();
            
            alert('Cliente actualizado exitosamente!');
          } catch (error) {
            console.error('Error completo:', error);
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
 *? Función para manejar el botón "Eliminar Cliente"
 */
export const handleDeleteClient = (clientId, setClients, currentClients) => {
  if (!clientId) {
    console.error('ID de cliente inválido');
    return;
  }
  
  showConfirmModal({
    message: '¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.',
    onConfirm: async () => {
      try {
        const response = await fetch(`http://localhost:3001/Api/clients/${clientId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar cliente');
        setClients(currentClients.filter(c => c.id !== clientId));
        alert('Cliente eliminado exitosamente!');
      } catch (err) {
        console.error('Error eliminando cliente:', err);
        alert('No se pudo eliminar el cliente: ' + err.message);
      }
    },
    onCancel: () => {}
  });
};

/**
 *?Función para manejar la búsqueda
 */
export const handleSearch = (searchTerm, clients, setClients) => {
  if (!searchTerm || searchTerm.trim() === '') {
    setClients(clients);
  }
};