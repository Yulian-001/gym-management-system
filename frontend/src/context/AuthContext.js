// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error al cargar usuario del localStorage:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (cedula, password) => {
    setLoading(true);
    setError(null);
    try {
      // Llamar a la API para validar las credenciales
      const response = await fetch('http://localhost:3001/Api/empleados/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cedula, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cédula o contraseña incorrecta');
      }

      const userData = await response.json();
      
      // Guardar usuario en estado y localStorage (incluso si requiere preguntas)
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'administrador',
    isManager: user?.rol === 'gerente',
    isReceptionist: user?.rol === 'recepcionista',
    canEdit: user?.rol === 'administrador' || user?.rol === 'gerente',
    canDelete: user?.rol === 'administrador' || user?.rol === 'gerente',
    canManagePlans: user?.rol === 'administrador' || user?.rol === 'gerente'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
