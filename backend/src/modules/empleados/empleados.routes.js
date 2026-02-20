// backend/src/modules/empleados/empleados.routes.js
const express = require('express');
const router = express.Router();
const empleadosController = require('./empleados.controller');

// Ruta de login
router.post('/login', empleadosController.login);

// Rutas de recuperación de contraseña
router.post('/recovery-questions', empleadosController.getRecoveryQuestions);
router.post('/validate-answers', empleadosController.validateSecurityAnswers);
router.post('/reset-password', empleadosController.resetPassword);

// Ruta para guardar preguntas de seguridad (debe ir ANTES de :id get)
router.post('/:id/security-questions', empleadosController.saveSecurityQuestions);

// Ruta para cambiar contraseña (debe ir ANTES de :id get)
router.put('/:id/change-password', empleadosController.changePassword);

// Obtener todos los empleados (solo para debug)
router.get('/debug/todos', empleadosController.getAllEmpleados);

// Obtener empleado por ID
router.get('/:id', empleadosController.getEmpleadoById);

// Crear empleado
router.post('/', empleadosController.createEmpleado);

// Actualizar empleado
router.put('/:id', empleadosController.updateEmpleado);

// Eliminar empleado
router.delete('/:id', empleadosController.deleteEmpleado);

module.exports = router;
