import React, { useState, useEffect } from 'react';
import './ContabilidadStyle.css';
import { EditIcon, TrashIcon } from '../../icons';

const EmployeeListPanel = ({ refreshTrigger, onEdit, onDelete }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar empleados
  const cargarEmpleados = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/Api/contabilidad/empleados');
      const result = await response.json();
      if (result.success) {
        setEmployees(result.data || []);
      } else {
        setError('No se pudieron cargar los empleados');
      }
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setError('Error al cargar empleados');
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarEmpleados();
  }, [refreshTrigger]);

  return (
    <div className="employee-list-panel">
      <h2>Empleados Registrados</h2>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Cargando empleados...</div>
      ) : employees && employees.length > 0 ? (
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Salario</th>
                <th>Estado</th>
                  <th>Fecha Contratación</th>
                  <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.cedula}</td>
                  <td>{emp.email || '-'}</td>
                  <td>{emp.cargo}</td>
                  <td>${(isNaN(parseFloat(emp.salario)) ? 0 : parseFloat(emp.salario)).toFixed(2)}</td>
                  <td>
                    <span className={`estado-badge estado-${emp.estado}`}>
                      {emp.estado}
                    </span>
                  </td>
                  <td>{new Date(emp.fecha_contratacion).toLocaleDateString('es-ES')}</td>
                  <td style={{ minWidth: '120px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="icon-btn edit"
                        title="Editar"
                        onClick={() => (onEdit ? onEdit(emp) : null)}
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        className="icon-btn delete"
                        title="Eliminar"
                        onClick={() => (onDelete ? onDelete(emp.id) : null)}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-message">No hay empleados registrados</div>
      )}
    </div>
  );
};

export default EmployeeListPanel;
