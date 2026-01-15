import React, { useState} from 'react';
import styles from './moduleStyle.css'


function ModulesSystem() { 
  const[activeTab, setActiveTab]= useState('admin'); 
  return (
    <div className="modulesContainer">

      <div className='modules-header' >

        <div className={`module-tab ${activeTab === 'admin' ? 'active':''}`}
        onClick={() => setActiveTab('admin')}
        >
          <h2 className='module-title'>Administración</h2>
        </div>
        <div className={`module-tab ${activeTab === 'contabilidad' ? 'active':''}`}
        onClick={() =>setActiveTab('contabilidad')}>
          <h2 className='module-title'>Contabilidad</h2>  
        </div>

        <div className={`module-tab ${activeTab === 'reportes' ? 'active':''}`}
        onClick={() =>setActiveTab('reportes')}>
          <h2 className='module-title'>Reportes</h2>
        </div>
      </div>
      
 <main className="modules-content">
        {activeTab === 'admin' && (
          <div className="module-panel">
            <h3>Panel de Administración</h3>
            <p>Gestión de clientes, empleados, inventario...</p>
          </div>
        )}
        
        {activeTab === 'contabilidad' && (
          <div className="module-panel">
            <h3>Panel de Contabilidad</h3>
            <p>Facturación, pagos, reportes financieros...</p>
          </div>
        )}
        
        {activeTab === 'reportes' && (
          <div className="module-panel">
            <h3>Panel de Reportes</h3>
            <p>Estadísticas, gráficos, análisis...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ModulesSystem; 