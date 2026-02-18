import React, { useState } from 'react';
import './EmployeeRegistrationFormStyle.css';
import { useEffect } from 'react';

const EmployeeRegistrationForm = ({ employee = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    cargo: 'Vendedor',
    salario: '',
    estado: 'activo'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }
    if (!formData.cedula.trim()) {
      setError('La cédula es obligatoria');
      setLoading(false);
      return;
    }
    if (!formData.cargo) {
      setError('El cargo es obligatorio');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (employee && employee.id) {
        // Actualizar
        response = await fetch(`http://localhost:3001/Api/contabilidad/empleados/${employee.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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
      } else {
        // Crear nuevo
        response = await fetch('http://localhost:3001/Api/contabilidad/empleados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al guardar empleado');

      setSuccessMessage(employee && employee.id ? 'Empleado actualizado' : 'Empleado registrado exitosamente');
      if (!employee) {
        setFormData({ nombre: '', cedula: '', email: '', telefono: '', cargo: 'Vendedor', salario: '', estado: 'activo' });
      }
      if (onSuccess) onSuccess();
      if (onCancel) onCancel();
    } catch (err) {
      console.error('Error al guardar empleado:', err);
      setError(err.message || 'Error al guardar empleado');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee) {
      setFormData({
        nombre: employee.nombre || '',
        cedula: employee.cedula || '',
        email: employee.email || '',
        telefono: employee.telefono || '',
        cargo: employee.cargo || 'Vendedor',
        salario: employee.salario || '',
        estado: employee.estado || 'activo'
      });
    }
  }, [employee]);

  return (
    <form onSubmit={handleSubmit} className="employee-registration-form">
      {error && <div className="error-alert">{error}</div>}
      {successMessage && <div className="success-alert">{successMessage}</div>}

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

      <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-registrar" disabled={loading}>
          {loading ? (employee ? 'Guardando...' : 'Registrando...') : (employee ? 'Actualizar Empleado' : 'Registrar Empleado')}
        </button>
      </div>
    </form>
  );
};

export default EmployeeRegistrationForm;
