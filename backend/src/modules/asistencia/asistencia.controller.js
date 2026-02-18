const AsistenciaService = require('./asistencia.service');

const createAsistencia = async (req, res) => {
  try {
    const { cliente_id, fecha_asistencia, hora_entrada, hora_salida, estado } = req.body;
    if (!cliente_id || !fecha_asistencia || !hora_entrada) {
      return res.status(400).json({ error: 'cliente_id, fecha_asistencia y hora_entrada son requeridos' });
    }
    const nueva = await AsistenciaService.createAsistencia(cliente_id, fecha_asistencia, hora_entrada, hora_salida || null, estado || 'presente');
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error creating asistencia:', error);
    res.status(500).json({ error: error.message });
  }
};

const getCounts = async (req, res) => {
  try {
    const rows = await AsistenciaService.getCountsByClient();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching asistencia counts:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAsistencia,
  getCounts
};
