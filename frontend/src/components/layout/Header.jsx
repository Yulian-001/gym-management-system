// src/components/layout/Header.jsx
import React, { useState } from 'react';
import './headerStyle.css'
import { UserIcon } from '../../icons';
import { useAuth } from '../../context/AuthContext';

//? Módulos operativos - Administracion - Contabilidad - Reportes
function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    // El contexto actualiza isAuthenticated y AppContent muestra Login automáticamente
  };

  // Obtener iniciales del nombre
  const getInitials = (nombre) => {
    if (!nombre) return 'U';
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className='container-header-header' style={{
      backgroundColor: '#c9ced3',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 6px 8px rgba(247, 238, 238, 0.9)',
      marginBottom: '1rem'
    }}>
      <div className='groud-container-header' style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          margin: 0,
          letterSpacing: '0.5px'
        }}>
           GYM Management
        </h1>
        <span style={{
          fontSize: '0.9rem',
          opacity: 0.9,
          borderLeft: '2px solid rgba(255,255,255,0.3)',
          paddingLeft: '1rem',
          display:'flex',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          margin:'0 0.5rem'
        }}>
          V 1.00.0
        </span>
      </div>

      <div className='groud-two-container-header' style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        fontSize: '0.95rem'
      }}>
        <div>
          <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>
            {new Date().toLocaleDateString('es-CO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p style={{ margin: '0.2rem 0', opacity: 0.85, fontSize: '0.85rem' }}>
            {new Date().toLocaleTimeString('es-CO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>

        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingLeft: '1rem',
            borderLeft: '2px solid rgba(255,255,255,0.3)',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: user?.rol === 'administrador' ? '#ff4757' : 
                           user?.rol === 'gerente' ? '#f39c12' : 
                           '#3498db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {getInitials(user?.nombre)}
          </div>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user?.nombre || 'Usuario'}</span>
            <p style={{ margin: '0.2rem 0', fontSize: '0.75rem', opacity: 0.8 }}>
              {user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1) || 'N/A'}
            </p>
          </div>

          {/* Menú desplegable */}
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #eee'
              }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                  {user?.nombre}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                  {user?.cedula}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                  Cargo: {user?.cargo}
                </p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#ff4757',
                  fontWeight: '600',
                  textAlign: 'left',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;