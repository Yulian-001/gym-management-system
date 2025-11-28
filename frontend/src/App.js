import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Detectar si estamos en desarrollo o producción y en qué host
const getApiUrl = () => {
  // Si el backend está en el mismo host que el frontend
  // usamos localhost, de lo contrario usamos el nombre del contenedor
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  return 'http://gym-backend:3000';
};

const API_URL = getApiUrl();

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/Api/health`);
      setHealth(response.data);
      setError(null);
    } catch (err) {
      setError('❌ No se pudo conectar con el backend');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏋️ Sistema de Gestión de Gimnasio</h1>
        <p>Sistema integral para administración de gimnasios</p>
        
        {/* Estado del sistema */}
        <div className="status-section">
          <h2>Estado del Sistema</h2>
          {loading ? (
            <div className="loading">🔄 Cargando...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : health ? (
            <div className="health-status">
              <div className="status-item">
                <strong>Backend:</strong> <span className="status-ok">✅ Conectado</span>
              </div>
              <div className="status-item">
                <strong>Environment:</strong> {health.environment}
              </div>
              <div className="status-item">
                <strong>Base de datos:</strong> {health.database}
              </div>
            </div>
          ) : null}
        </div>

        {/* Funcionalidades principales */}
        <div className="features">
          <h3>🚀 Funcionalidades Principales</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>👥 Gestión de Miembros</h4>
              <p>Registro y administración de socios</p>
            </div>
            <div className="feature-card">
              <h4>💳 Control de Pagos</h4>
              <p>Seguimiento de membresías y pagos</p>
            </div>
            <div className="feature-card">
              <h4>📅 Agenda de Clases</h4>
              <p>Programación y reservas de clases</p>
            </div>
            <div className="feature-card">
              <h4>📊 Reportes</h4>
              <p>Estadísticas y analytics</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;