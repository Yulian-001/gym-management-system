# Sistema de Autenticación y Roles - Gym Management System

## Descripción General

El sistema implementa un control de acceso basado en roles (RBAC) que permite diferencias acciones y permisos según el tipo de usuario que se autentica.

## Roles Disponibles

### 1. **Administrador** (Acceso Total)
- **Permisos:**
  - ✅ Agregar, editar y eliminar clientes
  - ✅ Gestionar planes (crear, actualizar, eliminar)
  - ✅ Ver y gestionar ventas
  - ✅ Acceso a Contabilidad y Reportes
  - ✅ Ver todas las opciones del sistema
  
- **Cedula de Prueba:** `1000000001`
- **Contraseña:** `admin123`

### 2. **Gerente** (Acceso Administrativo)
- **Permisos:**
  - ✅ Agregar, editar y eliminar clientes
  - ✅ Gestionar planes (crear, actualizar, eliminar)
  - ✅ Ver y gestionar ventas
  - ✅ Acceso a Contabilidad y Reportes
  - ✅ Ver todas las opciones del sistema
  
- **Cedula de Prueba:** `1000000002`
- **Contraseña:** `gerente123`

### 3. **Recepcionista** (Acceso Limitado)
- **Permisos:**
  - ✅ Ver clientes (solo lectura)
  - ❌ No puede agregar/editar/eliminar clientes
  - ❌ No puede gestionar planes
  - ❌ No puede gestionar ventas
  - ✅ Puede registrar entrada de clientes
  - ❌ No tiene acceso a Contabilidad y Reportes
  
- **Cedula de Prueba:** `1000000003`
- **Contraseña:** `recepcionista123`

## Módulos Visibles por Rol

### Módulo de Administración

| Función | Admin | Gerente | Recepcionista |
|---------|-------|---------|---------------|
| Entrada | ✅ | ✅ | ✅ |
| Clientes | ✅ | ✅ | ✅ (solo lectura) |
| Planes | ✅ | ✅ | ❌ |
| Ventas | ✅ | ✅ | ❌ |
| Día | ✅ | ✅ | ❌ |
| Estado | ✅ | ✅ | ❌ |
| Contabilidad | ✅ | ✅ | ❌ |

## Acciones Visibles en Tablas

### Tabla de Clientes
- **Botón Agregar:** Solo Admin y Gerente
- **Botón Editar:** Solo Admin y Gerente
- **Botón Eliminar:** Solo Admin y Gerente
- **Recepcionista:** Ver "Solo lectura" en lugar de botones

### Tabla de Planes
- **Botón Editar:** Solo Admin y Gerente
- **Botón Eliminar:** Solo Admin y Gerente
- **Recepcionista:** Ver "Solo lectura" en lugar de botones

## Estructura del Sistema de Autenticación

### AuthContext (`src/context/AuthContext.js`)
Maneja:
- Login de usuario
- Almacenamiento de sesión en localStorage
- Datos del usuario: nombre, cédula, rol, cargo
- Propiedades booleanas para verificar permisos

### Login Component (`src/components/Auth/Login.js`)
- Formulario para ingresar cédula y contraseña
- Validación en frontend
- Llamada a API `/Api/empleados/login`
- Redirección al home tras login exitoso

### Header Actualizado
- Muestra nombre del usuario logueado
- Muestra rol del usuario
- Menú desplegable con opción de cerrar sesión
- Color de avatar según rol (rojo: admin, naranja: gerente, azul: recepcionista)

### ProtectedRoute Component
- Verifica autenticación antes de acceder
- Protege rutas según roles permitidos
- Redirige a login si no está autenticado

## Endpoints de API

### POST `/Api/empleados/login`
Valida las credenciales del usuario.

**Request:**
```json
{
  "cedula": "1000000001",
  "password": "admin123"
}
```

**Response (éxito):**
```json
{
  "id": 1,
  "nombre": "Juan Administrador",
  "cedula": "1000000001",
  "email": "admin@gym.com",
  "telefono": "3001234567",
  "cargo": "Administrador",
  "rol": "administrador",
  "estado": "activo",
  "loginTime": "2026-02-18T10:30:00.000Z"
}
```

**Response (error):**
```json
{
  "success": false,
  "message": "Cédula o contraseña incorrecta"
}
```

## Base de Datos

### Cambios en Tabla `empleados`
Se agregaron dos columnas:
- `password` (VARCHAR 255): Contraseña del empleado
- `rol` (VARCHAR 50): Rol del empleado (administrador, gerente, recepcionista, vendedor)

### Script SQL para Datos de Prueba
Ver archivo: `database/insert_test_users.sql`

Ejecutar:
```sql
psql -U usuario -d gym_db -f insert_test_users.sql
```

## Cómo Implementar

### 1. Backend
1. Ejecutar script para agregar columnas a empleados
2. Ejecutar script para insertar usuarios de prueba
3. Las rutas ya están implementadas en `/src/modules/empleados/`

### 2. Frontend
1. AuthProvider ya está integrado en App.js
2. Login component accesible en `/login`
3. Componentes automáticamente muestran/ocultan opciones según rol

## Notas de Seguridad

⚠️ **IMPORTANTE:** 
- Las contraseñas se almacenan en texto plano en esta versión
- **EN PRODUCCIÓN:** Usar bcrypt o argon2 para hash de contraseñas
- Implementar tokens JWT en lugar de solo almacenar datos en localStorage
- Usar HTTPS para todas las conexiones
- Implementar rate limiting en endpoint de login

## Flujo de Autenticación

```
1. Usuario ingresa cedula y contraseña
   ↓
2. Login.js envía a API /Api/empleados/login
   ↓
3. Backend busca empleado por cedula
   ↓
4. Valida contraseña
   ↓
5. Si es válido, retorna datos del usuario
   ↓
6. AuthContext almacena en localStorage
   ↓
7. App.js redirige al home
   ↓
8. ModuleSystem muestra/oculta opciones según rol
```

## Ejemplo de Uso

**Para probar el sistema:**

1. Ir a `http://localhost:3000/login`
2. Ingresar:
   - Cédula: `1000000001` (Admin)
   - Contraseña: `admin123`
3. Debería ver todos los módulos
4. Repetir con otros roles para ver diferencias

## Archivos Modificados/Creados

### Nuevos
- `src/context/AuthContext.js` - Contexto de autenticación
- `src/components/Auth/Login.js` - Página de login
- `src/components/Auth/LoginStyle.css` - Estilos del login
- `src/components/Auth/ProtectedRoute.js` - Componente para proteger rutas
- `backend/src/modules/empleados/empleados.routes.js` - Rutas de API
- `backend/src/modules/empleados/empleados.controller.js` - Controlador
- `backend/src/modules/empleados/empleados.service.js` - Servicio de lógica
- `database/add_auth_to_empleados.sql` - Script para BD
- `database/insert_test_users.sql` - Datos de prueba

### Modificados
- `src/App.js` - Agregado enrutador y AuthProvider
- `src/components/layout/Header.jsx` - Muestra usuario y logout
- `src/components/Clients/ClientTable.js` - Condicionales de permisos
- `src/components/plans/PlansForm.js` - Condicionales de permisos
- `src/modules/ModuleSystem.jsx` - Muestra/oculta módulos según rol
- `backend/server.js` - Agregada ruta de empleados

---

**Versión:** 1.0.0  
**Fecha:** 18 de febrero de 2026  
**Estado:** ✅ Completo
