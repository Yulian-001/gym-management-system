// src/components/Auth/PasswordRecovery.js
import React, { useState } from 'react';
import './PasswordRecoveryStyle.css';

function PasswordRecovery({ onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: cédula, 2: preguntas, 3: nueva contraseña
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({ answer1: '', answer2: '', answer3: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [empleadoId, setEmpleadoId] = useState(null);

  // Paso 1: Validar cédula y cargar preguntas
  const handleLoadQuestions = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!cedula.trim()) {
        setError('Por favor ingresa tu cédula');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/Api/empleados/recovery-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Cédula no encontrada');
        return;
      }

      setEmpleadoId(result.data.id);
      setQuestions([
        { id: 1, text: result.data.pregunta_1 },
        { id: 2, text: result.data.pregunta_2 },
        { id: 3, text: result.data.pregunta_3 }
      ]);
      setStep(2);
    } catch (err) {
      console.error('Error cargando preguntas:', err);
      setError('Error al cargar preguntas de seguridad');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Validar respuestas
  const handleValidateAnswers = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!answers.answer1.trim() || !answers.answer2.trim() || !answers.answer3.trim()) {
        setError('Por favor responde todas las preguntas');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/Api/empleados/validate-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleadoId,
          respuesta_1: answers.answer1.toLowerCase().trim(),
          respuesta_2: answers.answer2.toLowerCase().trim(),
          respuesta_3: answers.answer3.toLowerCase().trim()
        })
      });

      const result = await response.json();

      if (!result.success) {
        setError('Una o más respuestas son incorrectas. Intenta de nuevo.');
        return;
      }

      setStep(3);
    } catch (err) {
      console.error('Error validando respuestas:', err);
      setError('Error al validar respuestas');
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Resetear contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setError('Por favor ingresa la nueva contraseña');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/Api/empleados/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleadoId,
          newPassword
        })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Error al resetear contraseña');
        return;
      }

      // Éxito
      if (onSuccess) onSuccess();
      alert('Contraseña reseteada exitosamente. Por favor inicia sesión con tu nueva contraseña.');
      onClose();
    } catch (err) {
      console.error('Error reseteando contraseña:', err);
      setError('Error al resetear contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-modal-overlay">
      <div className="recovery-modal">
        <button className="recovery-close-btn" onClick={onClose}>×</button>

        <h2 className="recovery-title">Recuperar Contraseña</h2>

        {error && (
          <div className="recovery-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* PASO 1: Cédula */}
        {step === 1 && (
          <form onSubmit={handleLoadQuestions} className="recovery-form">
            <div className="form-group">
              <label htmlFor="recovery-cedula">Cédula</label>
              <input
                id="recovery-cedula"
                type="text"
                placeholder="Ingresa tu cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                disabled={loading}
                className="form-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="recovery-btn"
            >
              {loading ? 'Cargando preguntas...' : 'Siguiente'}
            </button>
          </form>
        )}

        {/* PASO 2: Preguntas de Seguridad */}
        {step === 2 && (
          <form onSubmit={handleValidateAnswers} className="recovery-form">
            <p className="recovery-subtitle">Responde tus preguntas de seguridad</p>
            {questions.map((q, idx) => (
              <div key={q.id} className="form-group">
                <label htmlFor={`answer-${q.id}`}>
                  {q.id}. {q.text}
                </label>
                <input
                  id={`answer-${q.id}`}
                  type="password"
                  placeholder={`Respuesta a pregunta ${q.id}`}
                  value={answers[`answer${q.id}`]}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [`answer${q.id}`]: e.target.value
                    })
                  }
                  disabled={loading}
                  className="form-input"
                  autoComplete="off"
                />
              </div>
            ))}
            <div className="recovery-actions">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                className="recovery-btn-secondary"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={loading}
                className="recovery-btn"
              >
                {loading ? 'Validando...' : 'Siguiente'}
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: Nueva Contraseña */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="recovery-form">
            <p className="recovery-subtitle">Ingresa tu nueva contraseña</p>
            <div className="form-group">
              <label htmlFor="new-password">Nueva Contraseña</label>
              <input
                id="new-password"
                type="password"
                placeholder="Ingresa nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar Contraseña</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="form-input"
              />
            </div>
            <div className="recovery-actions">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setError('');
                }}
                className="recovery-btn-secondary"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={loading}
                className="recovery-btn"
              >
                {loading ? 'Reseteando...' : 'Resetear Contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PasswordRecovery;
