import React, { useState } from 'react';
import './SetupSecurityQuestionsStyle.css';

const SetupSecurityQuestions = ({ empleado, onSuccess, onSkip }) => {
  const [answers, setAnswers] = useState({
    respuesta_1: '',
    respuesta_2: '',
    respuesta_3: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const questions = [
    '¿Cuál fue el nombre de su primer mascota?',
    '¿Cuál es su número favorito entre 450 y 1500?',
    '¿Qué super poder quisiera tener?'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar que todas las respuestas estén completas
    if (!answers.respuesta_1.trim()) {
      setError('La respuesta 1 es obligatoria');
      setLoading(false);
      return;
    }
    if (!answers.respuesta_2.trim()) {
      setError('La respuesta 2 es obligatoria');
      setLoading(false);
      return;
    }
    if (!answers.respuesta_3.trim()) {
      setError('La respuesta 3 es obligatoria');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/Api/empleados/${empleado.id}/security-questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            respuesta_1: answers.respuesta_1.trim(),
            respuesta_2: answers.respuesta_2.trim(),
            respuesta_3: answers.respuesta_3.trim()
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar preguntas de seguridad');
      }

      setLoading(false);
      
      // Actualizar el usuario para indicar que ya respondió las preguntas
      const updatedUser = {
        ...empleado,
        requiresSecurityQuestions: false
      };
      
      onSuccess(updatedUser);
    } catch (err) {
      console.error('Error guardar preguntas:', err);
      setError(err.message || 'Error al guardar las preguntas de seguridad');
      setLoading(false);
    }
  };

  return (
    <div className="setup-security-overlay">
      <div className="setup-security-modal">
        <div className="setup-security-header">
          <h2>Configurar Preguntas de Seguridad</h2>
          <p>Empleado: <strong>{empleado.nombre}</strong> ({empleado.cedula})</p>
        </div>

        {error && <div className="setup-error">{error}</div>}

        <form onSubmit={handleSubmit} className="setup-security-form">
          {questions.map((question, index) => (
            <div key={index} className="setup-question-group">
              <label htmlFor={`respuesta_${index + 1}`}>
                {index + 1}. {question}
              </label>
              <input
                id={`respuesta_${index + 1}`}
                type="password"
                name={`respuesta_${index + 1}`}
                value={answers[`respuesta_${index + 1}`]}
                onChange={handleInputChange}
                placeholder="Ingresa tu respuesta"
                disabled={loading}
                className="setup-input"
                autoComplete="off"
              />
            </div>
          ))}

          <div className="setup-actions">
            <button
              type="button"
              onClick={onSkip}
              disabled={loading}
              className="setup-skip-btn"
            >
              Omitir por ahora
            </button>
            <button
              type="submit"
              disabled={loading}
              className="setup-submit-btn"
            >
              {loading ? 'Guardando...' : 'Guardar Preguntas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupSecurityQuestions;
