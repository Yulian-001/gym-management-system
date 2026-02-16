import React, { useState } from 'react';
import './moduleStyle.css';
import ClientTable from '../components/Clients/ClientTable';
import EntranceForm from '../components/Entrance/EntranceForm';
import PlansForm from '../components/plans/PlansForm';

//? rutas de iconos
import { 
  UsersIcon, 
  EnterIcon, 
  MoneyIcon, 
  DollarIcon, 
  CounterIcon, 
  ColdIcon 
} from '../icons'; 

function ModulesSystem() { 
  const [activeTab, setActiveTab] = useState('admin'); 
  const [activeAdminOption, setActiveAdminOption] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveAdminOption(null);
  };
  
  //? funcion para manejar click en opcion
  const handleOptionClick = (option) => {
    if (activeAdminOption === option) {
      setActiveAdminOption(null);
    } else {
      setActiveAdminOption(option);
    }
  };

  return (
    <div className="modulesContainer">
      <div className='modules-header'>
        <div className={`module-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => handleTabClick('admin')}>
          <h2 className='module-title'>Administración</h2>
        </div>

        <div className={`module-tab ${activeTab === 'contabilidad' ? 'active' : ''}`}
          onClick={() => setActiveTab('contabilidad')}>
          <h2 className='module-title'>Contabilidad</h2>  
        </div>

        <div className={`module-tab ${activeTab === 'reportes' ? 'active' : ''}`}
          onClick={() => setActiveTab('reportes')}>
          <h2 className='module-title'>Reportes</h2>
        </div>
      </div>
       
      {/*//? === Inicio de opciones de Modulos ===*/}

      <main className="modules-container-father">
  <div className='wrapper-option'>    
    <div className='modules-content'>
        {/*//? ===  Modulo Administracion  === */}
        {activeTab === 'admin' && (
          

              <div className='Container-option'>
                {/*//? ===  Entrada  === */}
                <div className={`container-icons ${activeAdminOption === 'entrada' ? 'active' : ''}`}
                  onClick={() => setActiveAdminOption('entrada')}>
                  <span>Entrada</span>
                  <div className={`module-options-container`}>
                    <EnterIcon className='options-icon' size={40} style={{color: activeAdminOption === 'entrada' ? '#1a86a2' : 'whiteSmoke'}} />
                  </div>
                </div>

                {/*//? === Clientes  === */}
                <div className={`container-icons ${activeAdminOption === 'clientes' ? 'active' : ''}`}
                  onClick={() => setActiveAdminOption('clientes')}>
                  <span>Clientes</span>
                  <div className={`module-options-container`}>
                    <UsersIcon className='options-icon' size={40} style={{color: activeAdminOption === 'clientes' ? '#1a86a2' : 'whiteSmoke'}} />
                  </div>
                </div> 

                {/*//? === planes === */}
                <div className={`container-icons ${activeAdminOption === 'planes' ? 'active' : ''}`}
                  onClick={() => setActiveAdminOption('planes')}>
                  <span>Planes</span>
                  <div className={`module-options-container`}>
                    <MoneyIcon className='options-icon' size={40} style={{color: activeAdminOption === 'planes' ? '#1a86a2' : 'whiteSmoke'}} />
                  </div>
                </div>

                {/*//? === Ventas  === */}
                <div className={`container-icons ${activeAdminOption === 'ventas' ? 'active' : ''}`}
                  onClick={() => setActiveAdminOption('ventas')}>
                  <span>Ventas</span>
                  <div className={`module-options-container`}>
                    <DollarIcon className='options-icon' size={40} style={{color: activeAdminOption === 'ventas' ? '#1a86a2' : 'whiteSmoke'}} />
                  </div>
                </div>

                {/*//? === Día  === */}
                <div className={`container-icons ${activeAdminOption === 'dia' ? 'active' : ''}`}
                  onClick={() => setActiveAdminOption('dia')}>
                  <span>Día</span>
                  <div className={`module-options-container`}>
                    <CounterIcon className='options-icon' size={40} style={{color: activeAdminOption === 'dia' ? '#1a86a2' : 'whiteSmoke'}} />
                  </div>
                </div>

                {/* //? === Estado  === */}
                <div className={`container-icons ${activeAdminOption === 'Estado' ? 'active' : ''}`}
                  onClick={() => setActiveAdminOption('Estado')}>
                  <span>Estado</span>
                  <div className={`module-options-container`}>
                    <ColdIcon className='options-icon' size={40} style={{color: activeAdminOption === 'Estado' ? '#1a86a2' : 'whiteSmoke'}} />

                  </div>
                </div>
           </div>

        )}
          
                

    </div>
     <div className='container-flex-option'>
              {/*//? Mostrar contenido según la opción seleccionada */}
                          {/*//todo === Clientes ===*/}
                      {activeAdminOption === 'clientes' && (
                        <div className='access-client' style={{ 
                        display:'flex',
                        width:'100%',
                        justifyContent:'center'
                        
                        }}>
                          <ClientTable />
                        </div>
                      )}

                      {/*//todo === Clientes ===*/}

                      {activeAdminOption === 'entrada' && (
                        <div className='access-entrance'>
                          <EntranceForm />
                        </div>
                      )}


                      {/*//todo === Planes ===*/}

                      {activeAdminOption === 'planes' && (
                        <div className='access-planes'>
                          <PlansForm />
                        </div>
                      )}

              </div>
    </div>  
  </main>
      

          

    </div>
  );
}

export default ModulesSystem;