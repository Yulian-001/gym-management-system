import React, { useEffect, useState } from 'react';

function EventosReport(){
  const [entries, setEntries] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const resp = await fetch('http://localhost:3001/Api/entradaDia');
        const data = resp.ok ? await resp.json() : [];
        setEntries(data);
        // contar por evento (suponiendo campo 'evento' o 'actividad')
        const map = {};
        data.forEach(d=>{
          const ev = d.evento || d.actividad || d.descripcion || 'General';
          map[ev] = (map[ev] || 0) + 1;
        });
        const arr = Object.keys(map).map(k=>({ evento:k, cantidad: map[k] }));
        arr.sort((a,b)=>b.cantidad - a.cantidad);
        setCounts(arr);
      }catch(err){
        console.error('Error eventos report', err);
      }
    };
    fetchData();
  },[]);

  return (
    <div>
      <h3>Eventos Más Solicitados</h3>
      {counts.length === 0 && <div>No hay registros de eventos</div>}
      <ol>
        {counts.map((c,i)=>(<li key={i}>{c.evento} — {c.cantidad} asistentes</li>))}
      </ol>
      <div style={{ marginTop: '1rem', color:'#666' }}>Nota: más adelante se añadirá visualización en barras.</div>
    </div>
  );
}

export default EventosReport;
