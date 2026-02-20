import React, { useState } from 'react';
import './App.css';
import Header from './components/layout/Header.jsx';
import ModulesSystem from './modules/ModuleSystem.jsx';
import Login from './components/Auth/Login';
import SetupSecurityQuestions from './components/Auth/SetupSecurityQuestions';
import ChangePasswordModal from './components/Auth/ChangePasswordModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SupportIcon } from './icons';

function AppContent() {
  const { isAuthenticated, user, loading, setUser } = useAuth();
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // Mostrar modales si requiere responder preguntas al cargar
  React.useEffect(() => {
    if (user && user.requiresSecurityQuestions) {
      setShowSecurityQuestions(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        background: '#2683ff'
      }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <div className='App' style={{ background: '#2683ff' }}>
        <Header />
        <ModulesSystem />
      </div>

      {showSecurityQuestions && user && (
        <SetupSecurityQuestions
          empleado={user}
          onSuccess={(updatedUser) => {
            // Actualizar usuario
            setUser(updatedUser);
            setShowSecurityQuestions(false);
            setShowChangePassword(true);
          }}
          onSkip={() => {
            // Actualizar usuario para marcar que salt ó las preguntas
            setUser({ ...user, requiresSecurityQuestions: false });
            setShowSecurityQuestions(false);
            setShowChangePassword(true);
          }}
        />
      )}

      {showChangePassword && user && (
        <ChangePasswordModal
          empleado={user}
          onSuccess={(updatedUser) => {
            setUser({ ...updatedUser, requiresSecurityQuestions: false });
            setShowChangePassword(false);
          }}
          onSkip={() => {
            setUser({ ...user, requiresSecurityQuestions: false });
            setShowChangePassword(false);
          }}
        />
      )}

      {/* Botón de soporte flotante */}
      <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 9999 }}>
        {showSupport && (
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '0.85rem 1.1rem',
            marginBottom: '0.6rem',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
            fontSize: '0.88rem',
            minWidth: '210px',
            borderLeft: '4px solid #2683ff'
          }}>
            <p style={{ margin: '0 0 0.2rem 0', fontWeight: '700', color: '#2683ff', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Soporte técnico</p>
            <a href="mailto:Nexusoporte@gmail.com" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>
              Nexusoporte@gmail.com
            </a>
          </div>
        )}
        <button
          onClick={() => setShowSupport(prev => !prev)}
          title="Soporte"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: showSupport ? '#1a6fd4' : '#2683ff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(38,131,255,0.45)',
            transition: 'background 0.2s'
          }}
        >
          <SupportIcon size={22} color="white" />
        </button>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;