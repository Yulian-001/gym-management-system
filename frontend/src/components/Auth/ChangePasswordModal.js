import React, { useState } from 'react';
import './ChangePasswordStyle.css';

const ChangePasswordModal = ({ empleado, onSuccess, onSkip }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!newPassword.trim()) {
      setError('La nueva contraseña es obligatoria');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/Api/empleados/${empleado.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newPassword: newPassword.trim()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al cambiar contraseña');
      }

      setSuccessMessage('¡Contraseña cambiada exitosamente!');
      setLoading(false);
      
      //? Esperar 1.5 segundos y cerrar
      setTimeout(() => {
        const updatedUser = {
          ...empleado,
          requiresSecurityQuestions: false  //? Ya no requiere preguntas después de cambiar contraseña
        };
        onSuccess(updatedUser);
      }, 1500);
    } catch (err) {
      console.error('Error cambiar contraseña:', err);
      setError(err.message || 'Error al cambiar la contraseña');
      setLoading(false);
    }
  };

  return (
    <div className="change-password-overlay">
      <div className="change-password-modal">
        <div className="change-password-header">
          <h2>Cambiar Contraseña</h2>
          <p>Por seguridad, cambia tu contraseña temporal</p>
        </div>

        {error && <div className="change-password-error">{error}</div>}
        {successMessage && <div className="change-password-success">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="password-group">
            <label htmlFor="newPassword">Nueva Contraseña </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              disabled={loading || !!successMessage}
              className="password-input"
              autoComplete="off"
            />
          </div>

          <div className="password-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              disabled={loading || !!successMessage}
              className="password-input"
              autoComplete="off"
            />
          </div>

          <div className="password-actions">
            <button
              type="button"
              onClick={onSkip}
              disabled={loading || !!successMessage}
              className="password-skip-btn"
            >
              Cambiar después
            </button>
            <button
              type="submit"
              disabled={loading || !!successMessage}
              className="password-submit-btn"
            >
              {loading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
