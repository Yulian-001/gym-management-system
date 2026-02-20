
const empleadosService = require('./empleados.service');

//? Login - Validar cedula y contraseña
exports.login = async (req, res) => {
  try {
    const { cedula, password } = req.body;

    //? Validar campos
    if (!cedula || !password) {
      return res.status(400).json({
        success: false,
        message: 'Cédula y contraseña son requeridas'
      });
    }

    //? Llamar al servicio de login
    const result = await empleadosService.login(cedula, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result.data);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar login: ' + error.message
    });
  }
};

//? Obtener todos los empleados
exports.getAllEmpleados = async (req, res) => {
  try {
    const result = await empleadosService.getAllEmpleados();
    res.json(result);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleados: ' + error.message
    });
  }
};

//? Obtener empleado por ID
exports.getEmpleadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await empleadosService.getEmpleadoById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleado: ' + error.message
    });
  }
};

//? Crear empleado
exports.createEmpleado = async (req, res) => {
  try {
    const { nombre, cedula, email, telefono, cargo, salario, password, rol, estado } = req.body;

    //? Validar campos requeridos para creacion
    if (!nombre || !cedula || !cargo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, cédula y cargo son requeridos'
      });
    }

    const result = await empleadosService.createEmpleado({
      nombre,
      cedula,
      email,
      telefono,
      cargo,
      salario,
      password: password || cedula, //? Contraseña por defecto es la cédula
      rol: rol || 'recepcionista',
      estado: estado || 'activo'
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear empleado: ' + error.message
    });
  }
};

//? Actualizar empleado
exports.updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, cargo, salario, password, rol, estado } = req.body;

    const result = await empleadosService.updateEmpleado(id, {
      nombre,
      email,
      telefono,
      cargo,
      salario,
      password,
      rol,
      estado
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar empleado: ' + error.message
    });
  }
};

//? Eliminar empleado
exports.deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await empleadosService.deleteEmpleado(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    res.json({ success: true, message: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar empleado: ' + error.message
    });
  }
};

//? Recuperación de contraseña: obtener preguntas de seguridad
exports.getRecoveryQuestions = async (req, res) => {
  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res.status(400).json({
        success: false,
        message: 'Cédula requerida'
      });
    }

    const result = await empleadosService.getRecoveryQuestions(cedula);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    //? Las preguntas son las mismas para todos
    const questions = {
      pregunta_1: '¿Cuál fue el nombre de su primer mascota?',
      pregunta_2: '¿Cuál es su número favorito entre 450 y 1500?',
      pregunta_3: '¿Qué super poder quisiera tener?'
    };

    res.json({
      success: true,
      data: {
        id: result.id,
        nombre: result.nombre,
        cedula: result.cedula,
        ...questions
      }
    });
  } catch (error) {
    console.error('Error al obtener preguntas de seguridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener preguntas: ' + error.message
    });
  }
};

//? Validar respuestas de seguridad
exports.validateSecurityAnswers = async (req, res) => {
  try {
    const { empleadoId, respuesta_1, respuesta_2, respuesta_3 } = req.body;

    if (!empleadoId || !respuesta_1 || !respuesta_2 || !respuesta_3) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    const result = await empleadosService.validateSecurityAnswers(
      empleadoId,
      respuesta_1,
      respuesta_2,
      respuesta_3
    );

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Una o más respuestas son incorrectas'
      });
    }

    res.json({
      success: true,
      message: 'Respuestas validadas correctamente'
    });
  } catch (error) {
    console.error('Error al validar respuestas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar respuestas: ' + error.message
    });
  }
};

//? Resetear contraseña
exports.resetPassword = async (req, res) => {
  try {
    const { empleadoId, newPassword } = req.body;

    if (!empleadoId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const result = await empleadosService.resetPassword(empleadoId, newPassword);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Contraseña reseteada correctamente'
    });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al resetear contraseña: ' + error.message
    });
  }
};

//? Guardar preguntas de seguridad
exports.saveSecurityQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta_1, respuesta_2, respuesta_3 } = req.body;

    if (!id || !respuesta_1 || !respuesta_2 || !respuesta_3) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    const result = await empleadosService.saveSecurityQuestions(
      id,
      respuesta_1,
      respuesta_2,
      respuesta_3
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Preguntas de seguridad guardadas correctamente',
      data: result
    });
  } catch (error) {
    console.error('Error al guardar preguntas de seguridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar preguntas: ' + error.message
    });
  }
};

//? Cambiar contrasena
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!id || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const result = await empleadosService.changePassword(id, newPassword);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Contraseña cambiada correctamente',
      data: result
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña: ' + error.message
    });
  }
};
