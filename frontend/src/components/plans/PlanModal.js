import React, { useState } from 'react';
import './PlanModalStyle.css';

function PlanModal({ onClose, onSuccess }) {
  const [planType, setPlanType] = useState('mensualidad');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Configuración de planes
  const planConfigs = {
    mensualidad: {
      name: 'Mensualidad',
      duration_days: 30,
      description: 'Acceso ilimitado por 30 días'
    },
    anual: {
      name: 'Anual',
      duration_days: 365,
      description: 'Acceso ilimitado por 365 días'
    },
    trimestre: {
      name: 'Trimestre',
      duration_days: 92,
      description: 'Acceso ilimitado por 92 días'
    },
    tiketera_x1: {
      name: 'Tiketera x1',
      duration_days: 15,
      description: '15 entradas (1 por día) en 15 días'
    },
    tiketera_x2: {
      name: 'Tiketera x2',
      duration_days: 30,
      description: '30 entradas (2 por día) en 30 días'
    },
    tiketera_x3: {
      name: 'Tiketera x3',
      duration_days: 45,
      description: '45 entradas (3 por día) en 45 días'
    }
  };

  const currentPlan = planConfigs[planType];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación
    if (!price || price <= 0) {
      setError('El precio debe ser mayor a 0');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/Api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentPlan.name,
          duration_days: currentPlan.duration_days,
          price: parseFloat(price)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el plan');
      }

      const newPlan = await response.json();
      setSuccess('Plan creado exitosamente');
      
      setTimeout(() => {
        onSuccess(newPlan);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al crear el plan');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-modal-overlay" onClick={onClose}>
      <div className="plan-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="plan-modal-header">
          <h2>Crear Nuevo Plan</h2>
          <button className="plan-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="plan-form">
          <div className="form-group">
            <label>Tipo de Plan *</label>
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              required
            >
              <option value="mensualidad">Mensualidad (30 días)</option>
              <option value="anual">Anual (365 días)</option>
              <option value="trimestre">Trimestre (92 días)</option>
              <option value="tiketera_x1">Tiketera x1 (15 entradas, 1 por día)</option>
              <option value="tiketera_x2">Tiketera x2 (30 entradas, 2 por día)</option>
              <option value="tiketera_x3">Tiketera x3 (45 entradas, 3 por día)</option>
            </select>
          </div>

          <div className="plan-info-box">
            <div className="info-row">
              <span className="info-label">Plan:</span>
              <span className="info-value">{currentPlan.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Duración:</span>
              <span className="info-value">{currentPlan.duration_days} días</span>
            </div>
            <div className="info-row">
              <span className="info-label">Descripción:</span>
              <span className="info-value">{currentPlan.description}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Precio ($) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 50000"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          {error && <div className="plan-alert error">{error}</div>}
          {success && <div className="plan-alert success">{success}</div>}

          <div className="plan-form-buttons">
            <button
              type="button"
              className="plan-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="plan-btn-submit"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanModal;
