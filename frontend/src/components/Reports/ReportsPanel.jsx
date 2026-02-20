import React, { useEffect, useState } from 'react';
import './ReportsStyle.css';
import CierreCajaReport from './CierreCajaReport';
import EgresosReport from './EgresosReport';
import ClientesDestacados from './ClientesDestacados';
import EventosReport from './EventosReport';
import HistoricoCierresReport from './HistoricoCierresReport';

function ReportsPanel({ option }) {
  const [hero, setHero] = useState({ ventas: 0, planes: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const s = await fetch('http://localhost:3001/Api/sales');
        const sales = s.ok ? await s.json() : [];
        const p = await fetch('http://localhost:3001/Api/plans');
        const plans = p.ok ? await p.json() : [];
        const totalVentas = sales.reduce((acc, v) => acc + (parseFloat(v.total) || 0), 0);
        setHero({ ventas: totalVentas, planes: plans.length });
      } catch (err) {
        console.error('Error loading hero summary', err);
      }
    };
    load();
  }, []);
  return (
    <div className="reports-container">
 
      <div className="reports-content">
        {option === 'cierre' && <CierreCajaReport />}
        {option === 'egresos' && <EgresosReport />}
        {option === 'clientes' && <ClientesDestacados />}
        {option === 'eventos' && <EventosReport />}
        {option === 'historico' && <HistoricoCierresReport />}
      </div>
    </div>
  );
}

export default ReportsPanel;
