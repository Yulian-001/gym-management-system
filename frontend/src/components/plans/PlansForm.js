import React, { useState, useEffect } from 'react';
import './PlanStyle.css';
import { EditIcon, TrashIcon } from '../../icons';
import { handleEditPlan, handleDeletePlan } from '../functions/planFunctions';
import { useAuth } from '../../context/AuthContext';

function PlansForm(){

    const [allPlans, setAllPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { user, canManagePlans } = useAuth();
    const isRecepcionista = user?.rol === 'recepcionista';

    // Cargar planes de la API
    useEffect(() => {
        const fetchPlans = async () => {
                try {
                    setLoading(true);
                    // Obtener todos los planes disponibles
                    const response = await fetch('http://localhost:3001/Api/plans');
                    if (!response.ok) throw new Error('Error al cargar planes');
                    const data = await response.json();
                    
                    // Excluir el plan 'Día'
                    const filtered = data.filter(p => {
                        if (!p || !p.name) return false;
                        const nameNorm = p.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                        return nameNorm !== 'dia' && nameNorm !== 'día';
                    });
                    
                    setAllPlans(filtered);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                    console.error('Error fetching planes:', err);
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
                                    {!isRecepcionista && <th style={{ textAlign: 'center' }}>Acción</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {allPlans.length > 0 ? allPlans.map((plan) => (
                            <tr key={plan.id} className='table-row'>
                                <td>{plan.id}</td>
                                <td>{plan.name}</td>
                                <td>{plan.duration_days}</td>
                                <td>{isFinite(parseFloat(plan.price)) ? `$${parseFloat(plan.price).toLocaleString('es-CO')}` : '-'}</td>
                                {!isRecepcionista && (
                                <td style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        {canManagePlans && (
                                            <>
                                                <button style={{ 
                                                    backgroundColor:'#d72727',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.45rem 0.66rem',
                                                    borderRadius: '6px',
                                                    cursor:'pointer',
                                                    fontSize:'12px',
                                                    transition: 'background-color 0.3s',
                                                    marginRight:'0.7rem',
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#d72727'}
                                                onClick={() => handleDeletePlan(plan.id, setAllPlans, allPlans)}>
                                                    <TrashIcon size={18} />
                                                </button>

                                                <button style={{
                                                    backgroundColor: '#3498db',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding:'0.45rem 0.66rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    transition: 'background-color 0.3s' 
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2750F5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                                                onClick={() => handleEditPlan(plan, setAllPlans, allPlans)}>
                                                    <EditIcon size={18} />
                                                </button>
                                            </>
                                        )}
                                </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={isRecepcionista ? "6" : "7"} style={{ textAlign: 'center', padding: '2rem' }}>
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