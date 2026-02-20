// backend/src/modules/empleados/empleados.service.js
const db = require('../../config/db');

class EmpleadosService {
  /**
   * Validar login con cedula y contraseña
   */
  static async login(cedula, password) {
    try {
      // Buscar empleado por cédula (sin filtrar por estado)
      const query = `
        SELECT id, nombre, cedula, email, telefono, cargo, rol, estado, created_at, respuesta_1
        FROM empleados
        WHERE cedula = $1
      `;
      
      const result = await db.query(query, [cedula]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Cédula o contraseña incorrecta'
        };
      }

      const empleado = result.rows[0];

      // Verificar que el empleado esté activo
      if (empleado.estado !== 'activo') {
        return {
          success: false,
          message: 'El usuario no está activo. Contacta al administrador.'
        };
      }

      // NOTA: En producción, usar bcrypt para comparar contraseñas
      // Por ahora, comparación simple (cambiar en producción)
      const passwordQuery = `
        SELECT password FROM empleados WHERE id = $1
      `;
      
      const passwordResult = await db.query(passwordQuery, [empleado.id]);
      const storedPassword = passwordResult.rows[0]?.password;

      // Comparación simple de contraseña (CAMBIAR EN PRODUCCIÓN)
      if (storedPassword !== password) {
        return {
          success: false,
          message: 'Cédula o contraseña incorrecta'
        };
      }

      // Verificar si ha respondido las preguntas de seguridad
      const hasAnsweredQuestions = empleado.respuesta_1 !== null;

      // Retornar datos del empleado sin la contraseña
      return {
        success: true,
        data: {
          id: empleado.id,
          nombre: empleado.nombre,
          cedula: empleado.cedula,
          email: empleado.email,
          telefono: empleado.telefono,
          cargo: empleado.cargo,
          rol: empleado.rol,
          estado: empleado.estado,
          loginTime: new Date().toISOString(),
          requiresSecurityQuestions: !hasAnsweredQuestions  // true si debe responder preguntas
        }
      };
    } catch (error) {
      console.error('Error en servicio de login:', error);
      return {
        success: false,
        message: 'Error al procesar login'
      };
    }
  }

  /**
   * Obtener todos los empleados
   */
  static async getAllEmpleados() {
    try {
      const query = `
        SELECT id, nombre, cedula, email, telefono, cargo, rol, estado, fecha_contratacion, created_at
        FROM empleados
        ORDER BY nombre ASC
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  }

  /**
   * Obtener empleado por ID
   */
  static async getEmpleadoById(id) {
    try {
      const query = `
        SELECT id, nombre, cedula, email, telefono, cargo, rol, estado, fecha_contratacion, created_at
        FROM empleados
        WHERE id = $1
      `;
      
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      throw error;
    }
  }

  /**
   * Crear empleado
   */
  static async createEmpleado(data) {
    try {
      const { nombre, cedula, email, telefono, cargo, salario, password, rol, estado } = data;

      const query = `
        INSERT INTO empleados (nombre, cedula, email, telefono, cargo, salario, password, rol, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, nombre, cedula, email, telefono, cargo, rol, estado, fecha_contratacion, created_at
      `;

      const result = await db.query(query, [
        nombre,
        cedula,
        email,
        telefono,
        cargo,
        salario,
        password,
        rol,
        estado
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  }

  /**
   * Actualizar empleado
   */
  static async updateEmpleado(id, data) {
    try {
      const { nombre, email, telefono, cargo, salario, password, rol, estado } = data;

      // Construir query dinámicamente solo con los campos proporcionados
      let query = 'UPDATE empleados SET ';
      const values = [];
      let index = 1;
      const setClauses = [];

      if (nombre !== undefined) {
        setClauses.push(`nombre = $${index++}`);
        values.push(nombre);
      }
      if (email !== undefined) {
        setClauses.push(`email = $${index++}`);
        values.push(email);
      }
      if (telefono !== undefined) {
        setClauses.push(`telefono = $${index++}`);
        values.push(telefono);
      }
      if (cargo !== undefined) {
        setClauses.push(`cargo = $${index++}`);
        values.push(cargo);
      }
      if (salario !== undefined) {
        setClauses.push(`salario = $${index++}`);
        values.push(salario);
      }
      if (password !== undefined) {
        setClauses.push(`password = $${index++}`);
        values.push(password);
      }
      if (rol !== undefined) {
        setClauses.push(`rol = $${index++}`);
        values.push(rol);
      }
      if (estado !== undefined) {
        setClauses.push(`estado = $${index++}`);
        values.push(estado);
      }

      if (setClauses.length === 0) {
        return null;
      }

      query += setClauses.join(', ') + ` WHERE id = $${index} RETURNING id, nombre, cedula, email, telefono, cargo, rol, estado`;
      values.push(id);

      const result = await db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      throw error;
    }
  }

  /**
   * Eliminar empleado
   */
  static async deleteEmpleado(id) {
    try {
      const query = `
        DELETE FROM empleados
        WHERE id = $1
        RETURNING id
      `;
      
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      throw error;
    }
  }

  /**
   * Obtener preguntas de seguridad para recuperación de contraseña
   */
  static async getRecoveryQuestions(cedula) {
    try {
      const query = `
        SELECT id, nombre, cedula, pregunta_1, pregunta_2, pregunta_3
        FROM empleados
        WHERE cedula = $1 AND estado = 'activo'
      `;
      const result = await db.query(query, [cedula]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error obteniendo preguntas de seguridad:', error);
      throw error;
    }
  }

  /**
   * Validar respuestas de seguridad
   */
  static async validateSecurityAnswers(empleadoId, respuesta_1, respuesta_2, respuesta_3) {
    try {
      const query = `
        SELECT id FROM empleados
        WHERE id = $1
          AND LOWER(respuesta_1) = LOWER($2)
          AND LOWER(respuesta_2) = LOWER($3)
          AND LOWER(respuesta_3) = LOWER($4)
      `;
      const result = await db.query(query, [empleadoId, respuesta_1, respuesta_2, respuesta_3]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error validando respuestas:', error);
      throw error;
    }
  }

  /**
   * Resetear contraseña
   */
  static async resetPassword(empleadoId, newPassword) {
    try {
      const query = `
        UPDATE empleados
        SET password = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, nombre, cedula
      `;
      const result = await db.query(query, [newPassword, empleadoId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error reseteando contraseña:', error);
      throw error;
    }
  }

  /**
   * Guardar preguntas de seguridad (respuestas)
   */
  static async saveSecurityQuestions(empleadoId, respuesta_1, respuesta_2, respuesta_3) {
    try {
      const query = `
        UPDATE empleados
        SET respuesta_1 = $1, respuesta_2 = $2, respuesta_3 = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, nombre, cedula, respuesta_1, respuesta_2, respuesta_3
      `;
      const result = await db.query(query, [respuesta_1, respuesta_2, respuesta_3, empleadoId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error guardando preguntas de seguridad:', error);
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(empleadoId, newPassword) {
    try {
      const query = `
        UPDATE empleados
        SET password = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, nombre, cedula
      `;
      const result = await db.query(query, [newPassword, empleadoId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }
}

module.exports = EmpleadosService;
