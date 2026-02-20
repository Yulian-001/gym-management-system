// src/components/Auth/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente para proteger rutas según autenticación y rol
 * @param {React.Component} Component - Componente a renderizar
 * @param {string[]} allowedRoles - Array de roles permitidos (ej: ['administrador', 'gerente'])
 */
function ProtectedRoute({ Component, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    );
  }

  // Si no está autenticado, mostrar Login
  if (!isAuthenticated) {
    return null; // AppContent muestra Login automáticamente
  }

  // Si se especificaron roles permitidos y el usuario no tiene uno de ellos
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <p>Tu rol actual: <strong>{user?.rol?.toUpperCase()}</strong></p>
        <a href="/" style={{ color: '#2683ff', textDecoration: 'none' }}>
          Volver al inicio
        </a>
      </div>
    );
  }

  return <Component />;
}

export default ProtectedRoute;
