import React, { useState} from 'react';
import styles from './moduleStyle.css'
import { FaUsersLine } from "react-icons/fa6";
import { CgEnter } from "react-icons/cg";
import ClientTble from '../components/Clients/ClientTable';
import { FaMoneyCheck, FaDollarSign  } from "react-icons/fa";
import { TbBrandDaysCounter } from "react-icons/tb";



function ModulesSystem() { 

  {/* */}
  const[activeTab, setActiveTab]= useState('admin'); 
  const[activeAcdminOption,SetActiveAdminOption]= useState('clientes')
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
      

      {/* Inicio de opciones de Modulos*/}
 <main className="modules-content">

  {/*Modulo Administracion */}
  
        {activeTab === 'admin' && (

          <div className='Container-option'>
              {/*Entrada*/}
           <div className= {`container-icons  ${activeAcdminOption === 'entrada' ? 'active': ''}`}
          onClick={() =>SetActiveAdminOption('entrada')} >
                 <span>Entrada</span>
          <div className={`module-options-container`}>
            <CgEnter className= 'options-icon' size={40} style={{color: activeAcdminOption === 'entrada' ? ' #1a86a2' : ' whiteSmoke'}} />
       
          </div>
          </div>





               {/*Clientes*/}
               <div className= {`container-icons  ${activeAcdminOption === 'clientes' ? 'active': ''}`}
          onClick={() =>SetActiveAdminOption('clientes')} >
                 <span>Clientes</span>
          <div className={`module-options-container`}>
            <FaUsersLine className= 'options-icon' size={40} style={{color: activeAcdminOption === 'clientes' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>

               {/*planes*/}
              <div className= {`container-icons  ${activeAcdminOption === 'planes' ? 'active': ''}`}
          onClick={() =>SetActiveAdminOption('planes')} >
                 <span>Clientes</span>
          <div className={`module-options-container`}>
            <FaMoneyCheck className= 'options-icon' size={40} style={{color: activeAcdminOption === 'planes' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>

           {/*Ventas*/}
           <div className= {`container-icons  ${activeAcdminOption === 'ventas' ? 'active': ''}`}
          onClick={() =>SetActiveAdminOption('ventas')} >
                 <span>Clientes</span>
          <div className={`module-options-container`}>
            <FaDollarSign className= 'options-icon' size={40} style={{color: activeAcdminOption === 'clientes' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>


           {/*Día*/}
              <div className= {`container-icons  ${activeAcdminOption === 'dia' ? 'active': ''}`}
          onClick={() =>SetActiveAdminOption('dia')} >
                 <span>Día</span>
          <div className={`module-options-container`}>
            <TbBrandDaysCounter className= 'options-icon' size={40} style={{color: activeAcdminOption === 'dia' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>

          
          </div>

        )}
       




        
        {activeTab === 'contabilidad' && (
          <div className="menu-item">

              <h3>contabilidad</h3>
          </div>
        )}
        
        {activeTab === 'reportes' && (
          <div className="module-panel">
            <h3>opcines de Reportes</h3>
            <p>Estadísticas, gráficos, análisis...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ModulesSystem; 