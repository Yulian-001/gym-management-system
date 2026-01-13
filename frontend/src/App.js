import React from 'react';
import './App.css';
import Header from './components/layout/Header';
import ClientTable from './components//Clients/ClientTable.js';


function App() {
  return (
    <div className="App">
         <thead>
            <div className='AdminModule'>
            <h2 className='AdminTitle' style={{ fontWeight:'400'}}> Adiministración</h2>
            
            </div>

            <div className='ContModule'>
            <h2 className='ContTitle' style={{ fontWeight:'400'}}>Contabilidad </h2>  
            </div>

            <div className='ReportModule'>
                <h2 className='ReportTitle' style={{ fontWeight:'400'}}>Reportes</h2>
            </div>
        </thead>
      <Header />
      <main style={{ padding: '30px' }}>
        <ClientTable />
        
      </main>
    </div>

  );
}

export default App;