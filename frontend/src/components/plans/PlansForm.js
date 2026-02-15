import React, { useState, useEffect } from 'react';
import './PlanStyle.css';

function PlanUsers(){

    const [plans, setPlans] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar planes de la API
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/Api/plans');
                if (!response.ok) throw new Error('Error al cargar planes');
                const data = await response.json();
                setAllPlans(data);
                setPlans(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching plans:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPlans();
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
        alert('Funcionalidad de añadir plan - próximamente');
    };

    const handleEditPlan = (planId) => {
        alert(`Editar plan ID: ${planId}`);
    };

    const handleDeletePlan = (planId) => {
        alert(`Eliminar plan ID: ${planId}`);
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando planes...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;


    return (
        <div className='head-container' style={{ 
            borderRadius: '0em 0em 1em 1em',
            marginTop: '0.5rem',
        }}> 

            {/* Header con título y botón */}
            <div className='header-button'>
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

                    {/* Botón Añadir Plan */}
                    <button className='AddClient' onClick={handleAddPlan}>
                        + Añadir Plan
                    </button>
                </div>

                {/* Barra de búsqueda */}
                <div className='searchClient'>
                    <input 
                        type='text'
                        className='searchC' 
                        placeholder='🔍 Buscar plan...' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className='ContainerTable'>
                <table className='TableScroll'>
                    <thead className='theadHeader'>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Plan</th>
                            <th>Duración (días)</th>
                            <th>Precio (COP)</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.length > 0 ? plans.map((plan) => (
                            <tr key={plan.id} className='table-row'>
                                <td>{plan.id}</td>
                                <td>{plan.name}</td>
                                <td>{plan.duration_days}</td>
                                <td>${parseFloat(plan.price).toLocaleString('es-CO')}</td>
                                <td>{plan.description || '-'}</td>
                                <td>
                                    <span style={{
                                        backgroundColor: plan.status === 'activo' ? '#37e167' : '#ff4757',
                                        color: 'white',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {plan.status}
                                    </span>
                                </td>
                                <td>
                                    <div className='action-buttons'>
                                        <button 
                                            className='btn-edit'
                                            onClick={() => handleEditPlan(plan.id)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className='btn-delete'
                                            onClick={() => handleDeletePlan(plan.id)}
                                        >
                                            Eliminar
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

export default PlanUsers;