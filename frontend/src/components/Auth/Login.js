// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginStyle.css';
import PasswordRecovery from './PasswordRecovery';

function Login() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar campos vacíos
      if (!cedula.trim() || !password.trim()) {
        setError('Por favor ingresa cédula y contraseña');
        setLoading(false);
        return;
      }

      console.log('Intentando login con cedula:', cedula);
      
      // Intentar login
      const userData = await login(cedula, password);
      
      console.log('Login exitoso:', userData);
      // Si el login es exitoso, el contexto actualiza isAuthenticated
      // y app.js mostrará los modales si requiere preguntas
      
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Gym Management System</h1>
          <p>Sistema de Gestión del Gimnasio</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="cedula">Cédula</label>
            <input
              id="cedula"
              type="text"
              placeholder="Ingresa tu cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <div className="recovery-link">
            <button
              type="button"
              onClick={() => setShowRecovery(true)}
              className="forgot-password-btn"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          
        </div>
      </div>

      {showRecovery && (
        <PasswordRecovery
          onClose={() => setShowRecovery(false)}
          onSuccess={() => setShowRecovery(false)}
        />
      )}
    </div>
  );
}

export default Login;
