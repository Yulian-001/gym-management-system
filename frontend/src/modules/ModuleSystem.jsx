import React, { useState} from 'react';
import styles from './moduleStyle.css'
import ClientTble from '../components/Clients/ClientTable';
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

  const[activeTab, setActiveTab]= useState('admin'); 
  const[activeAcdminOption,setActiveAdminOption]= useState('null');

  //? funcion para manejar  click en opcion
  const handleOptionClick = (option) => {
    if (activeAcdminOption === option){
      setActiveAdminOption(null);
    } else {
      setActiveAdminOption(option);
    }
  };
  

  return (
    <div className="modulesContainer">

      <div className='modules-header' >

        <div className={`module-tab ${activeTab === 'admin' ? 'active':''}`}
        onClick= {() => 
        setActiveTab('admin')}>

          <h2 className='module-title'>Administración</h2>
        </div>


        <div className={`module-tab ${activeTab === 'contabilidad' ? 'active':''}`}
        onClick={() => 
          setActiveTab('contabilidad')
        }>
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
          onClick={() =>setActiveAdminOption('entrada')} >
                 <span>Entrada</span>
          <div className={`module-options-container`}>
            <EnterIcon className= 'options-icon' size={40} style={{color: activeAcdminOption === 'entrada' ? ' #1a86a2' : ' whiteSmoke'}} />
       
          </div>
          </div>





               {/*Clientes*/}
               <div className= {`container-icons  ${activeAcdminOption === 'clientes' ? 'active': ''}`}
          onClick={() =>setActiveAdminOption('clientes')} >
                 <span>Clientes</span>
          <div className={`module-options-container`}>
            <UsersIcon className= 'options-icon' size={40} style={{color: activeAcdminOption === 'clientes' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>


               {/*planes*/}
              <div className= {`container-icons  ${activeAcdminOption === 'planes' ? 'active': ''}`}
          onClick={() =>setActiveAdminOption('planes')} >
                 <span>Planes</span>
          <div className={`module-options-container`}>
            <MoneyIcon className= 'options-icon' size={40} style={{color: activeAcdminOption === 'planes' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>

           {/*Ventas*/}
           <div className= {`container-icons  ${activeAcdminOption === 'ventas' ? 'active': ''}`}
          onClick={() =>setActiveAdminOption('ventas')} >
                 <span>Ventas</span>
          <div className={`module-options-container`}>
            <DollarIcon className= 'options-icon' size={40} style={{color: activeAcdminOption === 'ventas' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>


           {/*Día*/}
              <div className= {`container-icons  ${activeAcdminOption === 'dia' ? 'active': ''}`}
          onClick={() =>setActiveAdminOption('dia')} >
                 <span>Día</span>
          <div className={`module-options-container`}>
            <CounterIcon className= 'options-icon' size={40} style={{color: activeAcdminOption === 'dia' ? ' #1a86a2' : ' whiteSmoke'}} />
          </div>
          </div>

          

            {/*Estado*/}
              <div className= {`container-icons  ${activeAcdminOption === 'Estado' ? 'active': ''}`}
          onClick={() =>setActiveAdminOption('Estado')} >
                 <span>Estado</span>
          <div className={`module-options-container`}>
            <ColdIcon  className= 'options-icon' size={40} style={{color: activeAcdminOption === 'Estado' ? ' #1a86a2' : ' whiteSmoke'}} />
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