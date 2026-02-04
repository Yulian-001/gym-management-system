import React from 'react';
import './App.css';
import Header from './components/layout/Header.jsx';
import ClientTable from './components//Clients/ClientTable.js';
import ModulesSystem from './modules/ModuleSystem.jsx';


function App() {
  return (
    <div className='App' style={{ background:'#2683ff',}} >
      <Header />
      <ModulesSystem/>

    </div>

  );
}

export  default App;