import React, { useState, useEffect } from 'react';
import './EmployeeFormStyle.css';
import SetupSecurityQuestions from '../Auth/SetupSecurityQuestions';

const EmployeeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    cargo: 'Vendedor',
    salario: '',
    estado: 'activo'
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newEmpleado, setNewEmpleado] = useState(null);
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);

  const cargos = ['Vendedor', 'Recepcionista', 'Gerente', 'Administrador', 'Otro'];
  const estados = ['activo', 'inactivo', 'suspendido'];

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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError(null);
    setSuccessMessage(null);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      setRegistering(false);
      return;
    }
    if (!formData.cedula.trim()) {
      setError('La cédula es obligatoria');
      setRegistering(false);
      return;
    }
    if (!formData.cargo) {
      setError('El cargo es obligatorio');
      setRegistering(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/Api/contabilidad/empleados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          cedula: formData.cedula.trim(),
          email: formData.email.trim() || null,
          telefono: formData.telefono.trim() || null,
          cargo: formData.cargo,
          salario: formData.salario ? parseFloat(formData.salario) : null,
          estado: formData.estado
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar empleado');
      }

      // Guardar datos del empleado para el modal de preguntas de seguridad
      setNewEmpleado(result.data || result);
      
      // Solo mostrar modal de preguntas para ciertos cargos
      const requierePreguntas = ['Recepcionista', 'Gerente', 'Administrador'].includes(formData.cargo);
      setShowSecurityQuestions(requierePreguntas);

      setSuccessMessage('Empleado registrado exitosamente');
      setFormData({
        nombre: '',
        cedula: '',
        email: '',
        telefono: '',
        cargo: 'Vendedor',
        salario: '',
        estado: 'activo'
      });

      // Recargar la lista de empleados
      cargarEmpleados();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error al registrar:', err);
      setError(err.message || 'Error al registrar empleado');
    }
    setRegistering(false);
  };

  return (
    <div className="employee-form-container">
      {/* Sección del formulario */}
      <div className="employee-form-section">
        <h2>Registrar Nuevo Empleado</h2>

        {error && <div className="error-alert">{error}</div>}
        {successMessage && <div className="success-alert">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cedula">Cédula *</label>
              <input
                type="text"
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                placeholder="Ej: 123456789"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ej: juan@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Ej: +1 234 567 8900"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargo">Cargo *</label>
              <select
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                required
              >
                <option value="Vendedor">Vendedor</option>
                <option value="Recepcionista">Recepcionista</option>
                <option value="Gerente">Gerente</option>
                <option value="Administrador">Administrador</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salario">Salario Mensual</label>
              <input
                type="number"
                id="salario"
                name="salario"
                value={formData.salario}
                onChange={handleInputChange}
                placeholder="Ej: 1000.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-registrar" disabled={registering}>
              {registering ? 'Registrando...' : 'Registrar Empleado'}
            </button>
          </div>
        </form>
      </div>

      {/* Sección de lista de empleados */}
      <div className="employee-list-section">
        <h2>Empleados Registrados</h2>

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
                    <td>${(emp.salario || 0).toFixed(2)}</td>
                    <td>
                      <span className={`estado-badge estado-${emp.estado}`}>
                        {emp.estado}
                      </span>
                    </td>
                    <td>{new Date(emp.fecha_contratacion).toLocaleDateString('es-ES')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data-message">No hay empleados registrados</div>
        )}
      </div>

      {showSecurityQuestions && newEmpleado && (
        <SetupSecurityQuestions
          empleado={newEmpleado}
          onSuccess={() => {
            setShowSecurityQuestions(false);
            setNewEmpleado(null);
            if (onSuccess) onSuccess();
          }}
          onSkip={() => {
            setShowSecurityQuestions(false);
            setNewEmpleado(null);
            if (onSuccess) onSuccess();
          }}
        />
      )}
    </div>
  );
};

export default EmployeeForm;
