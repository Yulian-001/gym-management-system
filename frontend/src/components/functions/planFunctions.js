// src/components/functions/planFunctions.js
import React, { useState, useEffect } from 'react';
import { showModal, showConfirmModal } from './modalFunctions';

/**
 * Componente de formulario para plan
 */
const PlanForm = ({ plan, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    price: plan?.price || '',
    duration_days: plan?.duration_days || '',
    description: plan?.description || '',
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
    if (!formData.name || !formData.name.trim()) {
      alert('El nombre del plan es obligatorio');
      return;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      alert('El precio debe ser un número válido');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Nombre del Plan *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Precio *
        </label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Duración (días)
        </label>
        <input
          type="number"
          name="duration_days"
          value={formData.duration_days}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
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
            marginTop: '2rem',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#38eda8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#27cf8e'}
        >
          {plan ? 'Actualizar' : 'Crear Plan'}
        </button>
      </div>
    </form>
  );
};

/**
 * Función para manejar el botón "Editar Plan"
 */
export const handleEditPlan = (plan, setPlans, currentPlans) => {
  if (!plan || !plan.id) {
    console.error('Plan inválido para editar');
    return;
  }

  showModal({
    title: 'Editar Plan',
    content: (
      <PlanForm
        plan={plan}
        onSubmit={async (formData) => {
          try {
            const dataToSend = {
              name: formData.name.trim(),
              price: parseFloat(formData.price),
              duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
              description: (formData.description || '').trim()
            };

            console.log('Actualizando plan con datos:', dataToSend);

            const response = await fetch(`http://localhost:3001/Api/plans/${plan.id}`, {
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

            // Actualizar la lista con los datos retornados por la API
            const updatedPlans = currentPlans.map(p =>
              p.id === plan.id ? updated : p);
            setPlans(updatedPlans);

            // Cerrar modal
            const modal = document.querySelector('[id^="dynamic-modal-"]');
            if (modal) modal.remove();

            alert('Plan actualizado exitosamente!');
          } catch (error) {
            console.error('Error completo:', error);
            alert('Error al actualizar plan: ' + error.message);
          }
        }}
        onCancel={() => {
          const modal = document.querySelector('[id^="dynamic-modal-"]');
          if (modal) {
            modal.remove();
          }
        }}
      />
    )
  });
};

/**
 * Función para manejar el botón "Eliminar Plan"
 */
export const handleDeletePlan = (planId, setPlans, currentPlans) => {
  if (!planId) {
    console.error('ID de plan inválido');
    return;
  }

  showConfirmModal({
    message: '¿Estás seguro de eliminar este plan? Esta acción no se puede deshacer.',
    onConfirm: async () => {
      try {
        const response = await fetch(`http://localhost:3001/Api/plans/${planId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el plan');
        }

        // Actualizar la lista de planes
        const updatedPlans = currentPlans.filter(p => p.id !== planId);
        setPlans(updatedPlans);

        alert('Plan eliminado exitosamente!');
      } catch (err) {
        alert('Error al eliminar el plan: ' + err.message);
        console.error('Error:', err);
      }
    },
    onCancel: () => {
      console.log('Eliminación cancelada');
    }
  });
};
