const estadoService = require('./estado.service');

// Obtener clientes congelados
const getClientesCongelados = async (req, res) => {
  try {
    const clientes = await estadoService.getClientesCongelados();
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error fetching clientes congelados:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener clientes descongelados (histórico)
const getClientesDescongelados = async (req, res) => {
  try {
    const clientes = await estadoService.getClientesDescongelados();
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error fetching clientes descongelados:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener total de congelados
const getTotalClientesCongelados = async (req, res) => {
  try {
    const total = await estadoService.getTotalClientesCongelados();
    res.status(200).json({ total });
  } catch (error) {
    console.error('Error fetching total congelados:', error);
    res.status(500).json({ error: error.message });
  }
};

// Buscar cliente por nombre o cédula
const buscarCliente = async (req, res) => {
  try {
    const { busqueda } = req.query;

    if (!busqueda || busqueda.trim() === '') {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }

    const clientes = await estadoService.buscarCliente(busqueda.trim());
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error searching cliente:', error);
    res.status(500).json({ error: error.message });
  }
};

// Congelar cliente
const congelarCliente = async (req, res) => {
  try {
    const { cliente_id } = req.body;

    if (!cliente_id) {
      return res.status(400).json({ error: 'client_id requerido' });
    }

    // Verificar si ya está congelado
    const congelados = await estadoService.getClientesCongelados();
    const yaCongelado = congelados.find(c => c.cliente_id === cliente_id);

    if (yaCongelado) {
      return res.status(400).json({ error: 'Este cliente ya está congelado' });
    }

    const resultado = await estadoService.congelarCliente(cliente_id);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error freezing cliente:', error);
    res.status(500).json({ error: error.message });
  }
};

// Descongelar cliente
const descongelarCliente = async (req, res) => {
  try {
    const { congelado_id } = req.body;

    if (!congelado_id) {
      return res.status(400).json({ error: 'congelado_id requerido' });
    }

    const resultado = await estadoService.descongelarCliente(congelado_id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error unfreezing cliente:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getClientesCongelados,
  getClientesDescongelados,
  getTotalClientesCongelados,
  buscarCliente,
  congelarCliente,
  descongelarCliente
};
