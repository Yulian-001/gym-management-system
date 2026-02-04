// src/components/functions/modalFunctions.js - VERSIÓN CORREGIDA PARA REACT 18+
import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Crea y muestra un modal dinámicamente
 */
export const showModal = ({ title, content, onClose }) => {
  // Crear elemento contenedor
  const modalContainer = document.createElement('div');

  modalContainer.id = 'dynamic-modal-' + Date.now();

  // Estilos del overlay
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;
  
  // Componente del modal
  const ModalComponent = () => {
    const [isVisible, setIsVisible] = React.useState(true);
    
    const closeModal = () => {
      setIsVisible(false);
      setTimeout(() => {
        if (modalContainer.parentNode) {
          document.body.removeChild(modalContainer);
        }
        if (onClose) onClose();
      }, 300);
    };
    
    if (!isVisible) return null;
    
    return (
      <div 
        className="modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
      >
        <div 
          className="modal-content"
          style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'modalFadeIn 0.3s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderBottom: '1px solid #eaeaea',
          }}>
            <h2 style={{ margin: 0, color: '#2683ff' }}>{title}</h2>
            <button 
              onClick={closeModal}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ×
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            {content}
          </div>
        </div>
      </div>
    );
  };

  // Agregar estilos de animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Agregar al DOM
  document.body.appendChild(modalContainer);

  // Crear root y renderizar (React 18+)
  const root = createRoot(modalContainer);
  root.render(<ModalComponent />);

  // Retornar función para cerrar
  return () => {
    root.unmount();
    if (modalContainer.parentNode) {
      document.body.removeChild(modalContainer);
    }
  };
};

/**
 * Crea un modal de confirmación
 */
export const showConfirmModal = ({ message, onConfirm, onCancel }) => {
  return showModal({
    title: 'Confirmar acción',
    onClose: onCancel,
    content: (
      <div>
        <p style={{ marginBottom: '20px', fontSize: '16px' }}>{message}</p>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '20px',
        }}>
          <button
            onClick={() => {
              const modal = document.querySelector('[id^="dynamic-modal-"]');
              if (modal && modal.parentNode) {
                document.body.removeChild(modal);
              }
              if (onCancel) onCancel();
            }}
            style={{
              padding: '10px 20px',
              background: '#f1f2f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
           onMouseEnter={(e) => e.target.style.backgroundColor = '#d4d6dd'}
           onMouseLeave={(e) => e.target.style.backgroundColor = '#c3c7d6'}

          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const modal = document.querySelector('[id^="dynamic-modal-"]');
              if (modal && modal.parentNode) {
                document.body.removeChild(modal);
              }
              if (onConfirm) onConfirm();
            }}
            style={{
              padding: '10px 20px',
              background: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
           onMouseEnter={(e) => e.target.style.backgroundColor = '#ff0015'}
           onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4757'}

          >
            Confirmar
          </button>
        </div>
      </div>
    ),
  });
};