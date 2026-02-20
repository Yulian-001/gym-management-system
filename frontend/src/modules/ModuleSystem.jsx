import React, { useState } from 'react';
import './moduleStyle.css';
import ClientTable from '../components/Clients/ClientTable';
import EntranceForm from '../components/Entrance/EntranceForm';
import PlansForm from '../components/plans/PlansForm';
import SalesTable from '../components/Sales/SalesTable';
import DayEntryTable from '../components/DayEntry/DayEntryTable';
import EstadoPanel from '../components/Estado/EstadoPanel';
import ContabilidadPanel from '../components/Contabilidad/ContabilidadPanel';
import ReportsPanel from '../components/Reports/ReportsPanel';
import { useAuth } from '../context/AuthContext';

//? rutas de iconos
import { 
  UsersIcon, 
  EnterIcon, 
  MoneyIcon, 
  DollarIcon, 
  CounterIcon, 
  ColdIcon,
  ChartIcon,
  InvoiceIcon,
  CheckIcon,
  UserAddIcon
} from '../icons'; 

function ModulesSystem() { 
  const [activeTab, setActiveTab] = useState('admin'); 
  const [activeAdminOption, setActiveAdminOption] = useState(null);
  const [activeContabilidadOption, setActiveContabilidadOption] = useState(null);
  const [activeReportOption, setActiveReportOption] = useState(null);
  const { user, canManagePlans, canDelete, canEdit } = useAuth();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveAdminOption(null);
    setActiveContabilidadOption(null);
    setActiveReportOption(null);
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
          onClick={() => handleTabClick('contabilidad')}>
          <h2 className='module-title'>Contabilidad</h2>  
        </div>

        <div className={`module-tab ${activeTab === 'reportes' ? 'active' : ''}`}
          onClick={() => handleTabClick('reportes')}>
          <h2 className='module-title'>Reportes</h2>
        </div>
      </div>
       
      {/*//? === Inicio de opciones de Modulos ===*/}

      <main className="modules-container-father">
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

        {/*//? === Modulo Reportes  === */}

        {activeTab === 'reportes' && (
          <div className='Container-option'>
            <div className={`container-icons ${activeReportOption === 'historico' ? 'active' : ''}`} onClick={() => setActiveReportOption('historico')}>
              <span>Histórico de Cierres</span>
              <div className={`module-options-container`}>
                <ChartIcon className='options-icon' size={40} style={{color: activeReportOption === 'historico' ? '#1a86a2' : 'whiteSmoke'}} />
              </div>
            </div>

            <div className={`container-icons ${activeReportOption === 'egresos' ? 'active' : ''}`} onClick={() => setActiveReportOption('egresos')}>
              <span>Egresos</span>
              <div className={`module-options-container`}>
                <InvoiceIcon className='options-icon' size={40} style={{color: activeReportOption === 'egresos' ? '#1a86a2' : 'whiteSmoke'}} />
              </div>
            </div>

            <div className={`container-icons ${activeReportOption === 'clientes' ? 'active' : ''}`} onClick={() => setActiveReportOption('clientes')}>
              <span>Clientes Destacados</span>
              <div className={`module-options-container`}>
                <ChartIcon className='options-icon' size={40} style={{color: activeReportOption === 'clientes' ? '#1a86a2' : 'whiteSmoke'}} />
              </div>
            </div>

            <div className={`container-icons ${activeReportOption === 'eventos' ? 'active' : ''}`} onClick={() => setActiveReportOption('eventos')}>
              <span>Eventos</span>
              <div className={`module-options-container`}>
                <ChartIcon className='options-icon' size={40} style={{color: activeReportOption === 'eventos' ? '#1a86a2' : 'whiteSmoke'}} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reportes' && activeReportOption && (
          <div className='container-flex-option'>
            <ReportsPanel option={activeReportOption} />
          </div>
        )}
     {activeTab === 'admin' && <div className='container-flex-option'>
      
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

                      {/*//todo === Ventas ===*/}

                      {activeAdminOption === 'ventas' && (
                        <div className='access-ventas'>
                          <SalesTable />
                        </div>
                      )}

                      {/*//todo === Día ===*/}

                      {activeAdminOption === 'dia' && (
                        <div className='access-dia'>
                          <DayEntryTable />
                        </div>
                      )}

                      {/*//todo === Estado ===*/}

                      {activeAdminOption === 'Estado' && (
                        <div className='access-estado'>
                          <EstadoPanel />
                        </div>
                      )}

              </div>}

    {/*//? === Modulo Contabilidad  === */}
    {activeTab === 'contabilidad' && (
      <div className='Container-option'>
        {/*//? === Resumen de Caja === */}
        <div className={`container-icons ${activeContabilidadOption === 'resumen' ? 'active' : ''}`}
          onClick={() => setActiveContabilidadOption('resumen')}>
          <span> Caja</span>
          <div className={`module-options-container`}>
            <ChartIcon className='options-icon' size={40} style={{color: activeContabilidadOption === 'resumen' ? '#1a86a2' : 'whiteSmoke'}} />
          </div>
        </div>

        {/*//? === Ventas del Día === */}
        <div className={`container-icons ${activeContabilidadOption === 'ventas' ? 'active' : ''}`}
          onClick={() => setActiveContabilidadOption('ventas')}>
          <span>Ventas del Día</span>
          <div className={`module-options-container`}>
            <DollarIcon className='options-icon' size={40} style={{color: activeContabilidadOption === 'ventas' ? '#1a86a2' : 'whiteSmoke'}} />
          </div>
        </div>

        {/*//? === Egresos === */}
        <div className={`container-icons ${activeContabilidadOption === 'egresos' ? 'active' : ''}`}
          onClick={() => setActiveContabilidadOption('egresos')}>
          <span>Egresos</span>
          <div className={`module-options-container`}>
            <InvoiceIcon className='options-icon' size={40} style={{color: activeContabilidadOption === 'egresos' ? '#1a86a2' : 'whiteSmoke'}} />
          </div>
        </div>


        {/*//? === Cierre de Caja === */}
        <div className={`container-icons ${activeContabilidadOption === 'cierre' ? 'active' : ''}`}
          onClick={() => setActiveContabilidadOption('cierre')}>
          <span>Cierre de Caja</span>
          <div className={`module-options-container`}>
            <CheckIcon className='options-icon' size={40} style={{color: activeContabilidadOption === 'cierre' ? '#1a86a2' : 'whiteSmoke'}} />
          </div>
        </div>

        {/*//? === Registrar Empleados === */}
        {user?.rol !== 'recepcionista' && (
          <div className={`container-icons ${activeContabilidadOption === 'empleados' ? 'active' : ''}`}
            onClick={() => setActiveContabilidadOption('empleados')}>
            <span>Registrar Empleados</span>
            <div className={`module-options-container`}>
              <UserAddIcon className='options-icon' size={40} style={{color: activeContabilidadOption === 'empleados' ? '#1a86a2' : 'whiteSmoke'}} />
            </div>
          </div>
        )}
      </div>
    )}

    {/* Contenedor para mostrar la opción seleccionada */}
    {activeTab === 'contabilidad' && activeContabilidadOption && (
      <div className='container-flex-option'>
        <ContabilidadPanel option={activeContabilidadOption} />
      </div>
    )}
    
  </main>
      

          

    </div>
  );
}

export default ModulesSystem;