import React, { useState, useEffect } from 'react';

function EgresosReport() {
  const [egresos, setEgresos] = useState([]);
  const [form, setForm] = useState({ descripcion: '', monto: '', proveedor: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('egresos') || '[]');
    setEgresos(stored);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    const nuevo = { ...form, monto: parseFloat(form.monto || 0), fecha: new Date().toISOString() };
    const updated = [nuevo, ...egresos];
    setEgresos(updated);
    localStorage.setItem('egresos', JSON.stringify(updated));
    setForm({ descripcion: '', monto: '', proveedor: '' });
  };

  return (
    <div>
      <h3>Reportes de Egresos</h3>
      <div style={{ display:'flex', gap: '1rem', marginTop: '1rem' }}>
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input name="monto" placeholder="Monto" value={form.monto} onChange={handleChange} />
        <input name="proveedor" placeholder="Proveedor" value={form.proveedor} onChange={handleChange} />
        <button onClick={handleAdd} style={{ background:'#2683ff', color:'white', border:'none', padding:'6px 10px', borderRadius:6 }}>Agregar</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {egresos.length === 0 && <div>No hay egresos registrados</div>}
        {egresos.map((e, i) => (
          <div key={i} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight:700 }}>{e.descripcion}</div>
            <div style={{ color:'#666' }}>{e.proveedor} • {new Date(e.fecha).toLocaleString()} • ${parseFloat(e.monto||0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EgresosReport;
