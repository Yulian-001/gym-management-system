export const handleCongelar = async (cliente_id, refreshCallback) => {
  if (window.confirm('¿Estás seguro de que quieres CONGELAR la membresía de este cliente?')) {
    try {
      const response = await fetch('http://localhost:3001/Api/estado/congelar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cliente_id })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        return;
      }

      alert('Membresía congelada exitosamente');
      refreshCallback();
    } catch (error) {
      console.error('Error congelando cliente:', error);
      alert(`Error: ${error.message}`);
    }
  }
};

export const handleDescongelar = async (congelado_id, refreshCallback) => {
  if (window.confirm('¿Estás seguro de que quieres DESCONGELAR la membresía de este cliente?')) {
    try {
      const response = await fetch('http://localhost:3001/Api/estado/descongelar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ congelado_id })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        return;
      }

      alert('Membresía descongelada exitosamente');
      refreshCallback();
    } catch (error) {
      console.error('Error descongelando cliente:', error);
      alert(`Error: ${error.message}`);
    }
  }
};
