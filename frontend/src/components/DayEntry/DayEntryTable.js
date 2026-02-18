import React, { useEffect, useState } from 'react';
import './DayEntryStyle.css';
import { handleAddEntry, handleEditEntry, handleDeleteEntry } from '../functions/dayEntryFunctions';
import { EditIcon, TrashIcon } from '../../icons';
function DayEntryTable() {
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar entradas
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/Api/entrada-dia');
        if (!response.ok) throw new Error('Error al cargar entradas');
        const data = await response.json();
        setAllEntries(data);
        setEntries(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setEntries(allEntries);
    } else {
      const results = allEntries.filter(entry =>
        entry.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEntries(results);
    }
  }, [searchTerm, allEntries]);

  // Refrescar tabla
  const refreshEntries = async () => {
    try {
      const response = await fetch('http://localhost:3001/Api/entrada-dia');
      if (response.ok) {
        const data = await response.json();
        setAllEntries(data);
        setEntries(data);
      }
    } catch (err) {
      console.error('Error refreshing entries:', err);
    }
  };

  if (loading) return <div className="day-container"><p>Cargando entradas...</p></div>;
  if (error) return <div className="day-container"><p>Error: {error}</p></div>;

  return (
    <div style={{ padding: '1.5rem' }} className="day-container">
      <h1 style={{ color: '#2683ff', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>Entradas del Día</h1>

      <div className="day-controls">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="day-search"
        />
        <button
          className="day-btn-add"
          onClick={() => handleAddEntry(refreshEntries)}
        >
          + Nueva Entrada
        </button>
      </div>

      <div className="day-table-wrapper">
        <table className="day-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Cliente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Método Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.nombre_cliente}</td>
                  <td>{new Date(entry.fecha).toLocaleDateString()}</td>
                  <td>{entry.hora}</td>
                  <td>{entry.metodo_pago}</td>
                  <td className={`estado-${entry.estado}`}>{entry.estado}</td>
                  <td className="day-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditEntry(entry, refreshEntries)}
                    >
                      <EditIcon size={18} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteEntry(entry.id, refreshEntries)}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No hay entradas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DayEntryTable;
