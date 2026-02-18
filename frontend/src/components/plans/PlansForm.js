import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './PlanStyle.css';
import PlanModal from './PlanModal';
import { EditIcon, TrashIcon } from '../../icons';
import { handleSellPlan } from '../functions/salesFunctions';

function PlansForm(){

    const [plans, setPlans] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Cargar planes de la API
    useEffect(() => {
        const fetchPlans = async () => {
                try {
                    setLoading(true);
                    // Obtener resumen de cierre del día para ver planes vendidos
                    const today = new Date().toISOString().split('T')[0];
                    const response = await fetch(`http://localhost:3001/Api/contabilidad/cierre-resumen?fecha=${today}`);
                    if (!response.ok) throw new Error('Error al cargar planes vendidos');
                    const resJson = await response.json();
                    const data = resJson.data?.planes || [];
                    // Excluir entradas sin plan (productos u otros) y el plan 'Día'
                    const filtered = data.filter(p => {
                        if (!p) return false;
                        // si no hay id de plan, corresponde a venta sin plan -> excluir
                        if (!p.id) return false;
                        if (!p.plan_nombre) return false;
                        const nameNorm = p.plan_nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                        return nameNorm !== 'dia' && nameNorm !== 'día' && !nameNorm.includes('sin plan');
                    });
                    // Mapear para mantener compatibilidad con la tabla
                    const mapped = filtered.map(p => ({
                        id: p.id,
                        name: p.plan_nombre,
                        duration_days: null,
                        price: p.precio,
                        description: '',
                        status: 'vendido',
                        cantidad_vendida: p.cantidad_vendida || 0,
                        total_generado: p.total_generado || 0
                    }));
                    setAllPlans(mapped);
                    setPlans(mapped);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                    console.error('Error fetching planes vendidos:', err);
                } finally {
                    setLoading(false);
                }
            };
        
        fetchPlans();
    }, [refreshTrigger]);

    // Escuchar evento global 'saleCreated' para forzar recarga
    useEffect(() => {
        const handler = () => setRefreshTrigger(r => r + 1);
        window.addEventListener('saleCreated', handler);
        return () => window.removeEventListener('saleCreated', handler);
    }, []);

    // Filtrar planes en tiempo real
    useEffect(() => {
        if(searchTerm.trim() === ''){
            setPlans(allPlans);
        } else {
            const results = allPlans.filter(plan => 
                plan.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setPlans(results);
        }
    }, [searchTerm, allPlans]);

    const handleAddPlan = () => {
        alert('Esta vista es de observación de planes vendidos. Para crear nuevos tipos de plan, usa la sección de administración de planes (si aplica).');
    };

    const handleEditPlan = (planId) => {
        alert(`Editar plan ID: ${planId} - Próximamente`);
    };

    const handleDeletePlan = async (planId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este plan?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/Api/plans/${planId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el plan');
            }

            // Actualizar la lista de planes
            const updatedAllPlans = allPlans.filter(plan => plan.id !== planId);
            setAllPlans(updatedAllPlans);
            setPlans(updatedAllPlans);
            alert('Plan eliminado exitosamente');
        } catch (err) {
            alert('Error al eliminar el plan: ' + err.message);
            console.error('Error:', err);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando planes...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;


    return (
        <div className='head-container' style={{ 
            borderRadius: '0em 0em 1em 1em',
            marginTop: '0.5rem',
        }}> 

            {/* Header con título y botón */}
            <div className='header-container-plans'>
                <div className='headBorder'>
                    <h2 className='TableTitle' style={{
                        fontSize: '1.4rem',
                        margin: '0em 1em 0em 0em',
                        fontWeight: '600',
                        display: 'inline',
                        whiteSpace: 'nowrap',
                        color: '#2683ff',
                        paddingRight: '2em',
                    }}>Gestión de Planes</h2>

                    {/* Botón Añadir Plan eliminado: vista de solo observación */}
                </div>

               
            </div>

            {/* Tabla */}
            <div className='ContainerTable'>
                <table className='TableScroll'>
                    <thead className='theadHeader-plans'>
                        <tr style={{ textTransform:'capitalize'}}>
                            <th>Id</th>
                            <th>Nombre Plan</th>
                                <th> Días</th>
                                    <th>Precio  </th>
                                    <th>Vendidos</th>
                                    <th>Total Generado</th>
                                    <th style={{ textAlign: 'center' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.length > 0 ? plans.map((plan) => (
                            <tr key={plan.id} className='table-row'>
                                <td>{plan.id}</td>
                                <td>{plan.name}</td>
                                <td>{plan.duration_days}</td>
                                <td>{isFinite(parseFloat(plan.price)) ? `$${parseFloat(plan.price).toLocaleString('es-CO')}` : '-'}</td>
                                <td>{plan.cantidad_vendida || 0}</td>
                                <td>{isFinite(parseFloat(plan.total_generado)) ? `$${parseFloat(plan.total_generado).toLocaleString('es-CO')}` : '$0'}</td>
                                <td>
                                        <div className='action-buttons-plans'>
                                        <button 
                                            className='btn-view'
                                            onClick={() => alert('Esta vista muestra planes vendidos del día. Para más detalles, abre Contabilidad → Cierre de Caja.')}
                                        >
                                            Ver
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No hay planes registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PlansForm;