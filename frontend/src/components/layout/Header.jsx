// src/components/layout/Header.jsx
import React from 'react';
import './headerStyle.css'

//? Módulos operativos - Administracion - Contabilidad - Reportes
function Header() {
  return (
    <header style={{
      backgroundColor: '#2683ff',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <div style={{
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
          💪 GYM Management
        </h1>
        <span style={{
          fontSize: '0.9rem',
          opacity: 0.9,
          borderLeft: '2px solid rgba(255,255,255,0.3)',
          paddingLeft: '1rem'
        }}>
          Sistema de Gestión Deportiva
        </span>
      </div>

      <div style={{
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

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingLeft: '1rem',
          borderLeft: '2px solid rgba(255,255,255,0.3)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            👤
          </div>
          <span style={{ fontSize: '0.9rem' }}>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;