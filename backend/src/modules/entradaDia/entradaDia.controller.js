const entradaService = require('./entradaDia.service');

//? Obtener todas las entradas
const getAllEntradas = async (req, res) => {
  try {
    const { empleado_id, rol } = req.query;
    const entradas = await entradaService.getAllEntradas(
      empleado_id ? parseInt(empleado_id) : null,
      rol || null
    );
    res.status(200).json(entradas);
  } catch (error) {
    console.error('Error fetching entradas:', error);
    res.status(500).json({ error: error.message });
  }
};

//? Obtener entrada por ID
const getEntradaById = async (req, res) => {
  try {
    const { id } = req.params;
    const entrada = await entradaService.getEntradaById(id);
    
    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    
    res.status(200).json(entrada);
  } catch (error) {
    console.error('Error fetching entrada:', error);
    res.status(500).json({ error: error.message });
  }
};

//? Crear nueva entrada
const createEntrada = async (req, res) => {
  try {
    const { nombre_cliente, fecha, hora, metodo_pago, estado, evento, evento_precio, empleado_id } = req.body;
    
    //? Validaciones de campos requeridos
    if (!nombre_cliente || !fecha || !hora || !metodo_pago) {
      return res.status(400).json({ error: 'Faltan campos requeridos: nombre_cliente, fecha, hora, metodo_pago' });
    }
    
    const metodos_validos = ['efectivo', 'tarjeta', 'transferencia'];
    if (!metodos_validos.includes(metodo_pago)) {
      return res.status(400).json({ error: 'Método de pago inválido. Usa: efectivo, tarjeta, transferencia' });
    }
    
    const estados_validos = ['activa', 'cancelada', 'completada'];
    const estadoFinal = estado && estados_validos.includes(estado) ? estado : 'activa';
    
    const entrada = await entradaService.createEntrada(
      nombre_cliente.trim(),
      fecha,
      hora,
      metodo_pago,
      estadoFinal,
      evento || null,
      evento_precio || null,
      empleado_id ? parseInt(empleado_id) : null
    );
    
    res.status(201).json(entrada);
  } catch (error) {
    console.error('Error creating entrada:', error);
    res.status(500).json({ error: error.message });
  }
};

//? Actualizar entrada
const updateEntrada = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_cliente, fecha, hora, metodo_pago, estado, evento, evento_precio } = req.body;
    
    //? Validaciones de campos para actualizacion
    if (!nombre_cliente || !fecha || !hora || !metodo_pago) {
      return res.status(400).json({ error: 'Faltan campos requeridos: nombre_cliente, fecha, hora, metodo_pago' });
    }
    
    const metodos_validos = ['efectivo', 'tarjeta', 'transferencia'];
    if (!metodos_validos.includes(metodo_pago)) {
      return res.status(400).json({ error: 'Método de pago inválido. Usa: efectivo, tarjeta, transferencia' });
    }
    
    const estados_validos = ['activa', 'cancelada', 'completada'];
    const estadoFinal = estado && estados_validos.includes(estado) ? estado : 'activa';
    
    const entrada = await entradaService.updateEntrada(
      id,
      nombre_cliente.trim(),
      fecha,
      hora,
      metodo_pago,
      estadoFinal,
      evento || null,
      evento_precio || null
    );
    
    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    
    res.status(200).json(entrada);
  } catch (error) {
    console.error('Error updating entrada:', error);
    res.status(500).json({ error: error.message });
  }
};

//? Eliminar entrada
const deleteEntrada = async (req, res) => {
  try {
    const { id } = req.params;
    const entrada = await entradaService.deleteEntrada(id);
    
    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    
    res.status(200).json({ message: 'Entrada eliminada exitosamente', entrada });
  } catch (error) {
    console.error('Error deleting entrada:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEntradas,
  getEntradaById,
  createEntrada,
  updateEntrada,
  deleteEntrada
};
