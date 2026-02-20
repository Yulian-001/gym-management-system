import React, { useEffect, useState } from 'react';

function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

function isConsecutiveMonths(sortedMonths) {
  if (sortedMonths.length === 0) return false;
  let count = 1;
  let max = 1;
  for (let i = 1; i < sortedMonths.length; i++) {
    const [y1, m1] = sortedMonths[i-1].split('-').map(Number);
    const [y2, m2] = sortedMonths[i].split('-').map(Number);
    const diff = (y2 - y1) * 12 + (m2 - m1);
    if (diff === 1) count++; else count = 1;
    if (count > max) max = count;
  }
  return max >= 9;
}

function ClientesDestacados(){
  const [entries, setEntries] = useState([]);
  const [clients, setClients] = useState([]);
  const [destacados, setDestacados] = useState([]);

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const eResp = await fetch('http://localhost:3001/Api/entradaDia');
        const entr = eResp.ok ? await eResp.json() : [];
        setEntries(entr);
        const cResp = await fetch('http://localhost:3001/Api/clients');
        const cl = cResp.ok ? await cResp.json() : [];
        setClients(cl);

        // Calcular meses por cliente
        const map = {};
        entr.forEach(en=>{
          if (!en.cliente_id) return;
          const key = monthKey(en.fecha || en.created_at || new Date());
          map[en.cliente_id] = map[en.cliente_id] || new Set();
          map[en.cliente_id].add(key);
        });

        const found = [];
        for (const id of Object.keys(map)){
          const months = Array.from(map[id]).sort();
          if (isConsecutiveMonths(months)){
            const client = cl.find(c=>String(c.id) === String(id));
            found.push(client || { id, nombre: `Cliente ${id}` });
          }
        }
        setDestacados(found);
      }catch(err){
        console.error('Error clientes destacados', err);
      }
    };
    fetchData();
  },[]);

  return (
    <div>
      <h3>Clientes Destacados</h3>
      <p>Se detectan clientes con al menos 9 meses consecutivos de asistencia.</p>
      {destacados.length === 0 && <div>No hay clientes destacados aún</div>}
      {destacados.map(c=> (
        <div key={c.id} style={{ padding:'8px', borderBottom:'1px solid #eee' }}>
          <div style={{ fontWeight:700 }}>{c.nombre}</div>
          <div style={{ color:'#666' }}>ID: {c.id}</div>
        </div>
      ))}
    </div>
  );
}

export default ClientesDestacados;
