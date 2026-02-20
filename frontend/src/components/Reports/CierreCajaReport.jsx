import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function CierreCajaReport() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ ventas: 0, planes: 0, productos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ventas
        const salesResp = await fetch('http://localhost:3001/Api/sales');
        const sales = salesResp.ok ? await salesResp.json() : [];

        // planes vendidos (intentar obtener desde /Api/plans o /Api/sales según modelo)
        const plansResp = await fetch('http://localhost:3001/Api/plans');
        const plans = plansResp.ok ? await plansResp.json() : [];

        // productos: aquí se asume que las ventas incluyen productos en campo descripcion
        const totalVentas = sales.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
        const totalPlanes = plans.length > 0 ? plans.reduce((s, p) => s + (parseFloat(p.precio) || 0), 0) : 0;

        setSummary({ ventas: totalVentas, planes: totalPlanes, productos: 0 });
      } catch (err) {
        console.error('Error cargando datos cierre:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async () => {
    const payload = {
      user_id: user?.id || null,
      user_nombre: user?.nombre || user?.username || 'Desconocido',
      fecha: new Date().toISOString(),
      resumen: summary
    };

    try {
      const resp = await fetch('http://localhost:3001/Api/reports/cierre', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error('No se pudo registrar en el servidor');
      alert('Cierre de caja registrado correctamente');
    } catch (err) {
      console.warn('Registro remoto falló, guardando localmente', err);
      const pending = JSON.parse(localStorage.getItem('pendingCierres') || '[]');
      pending.push(payload);
      localStorage.setItem('pendingCierres', JSON.stringify(pending));
      alert('Cierre guardado en local (pendiente de sincronizar)');
    }
  };

  if (loading) return <div>Cargando resumen...</div>;

  return (
    <div>
      <h3>Cierre de Caja</h3>
      <p><strong>Usuario:</strong> {user?.nombre || user?.username || 'Sin sesión'}</p>
      <p><strong>Fecha / Hora:</strong> {new Date().toLocaleString()}</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ padding: '1rem', background:'#f7fafc', borderRadius:8 }}>
          <div style={{ color:'#666' }}>Total Ventas</div>
          <div style={{ fontSize: '1.2rem', fontWeight:700 }}>{summary.ventas.toLocaleString?.() || summary.ventas}</div>
        </div>

        <div style={{ padding: '1rem', background:'#f7fafc', borderRadius:8 }}>
          <div style={{ color:'#666' }}>Total Planes</div>
          <div style={{ fontSize: '1.2rem', fontWeight:700 }}>{summary.planes.toLocaleString?.() || summary.planes}</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleRegister} style={{ background:'#27cf8e', color:'white', padding:'10px 16px', borderRadius:6, border:'none' }}>Registrar Cierre de Caja</button>
      </div>
    </div>
  );
}

export default CierreCajaReport;
