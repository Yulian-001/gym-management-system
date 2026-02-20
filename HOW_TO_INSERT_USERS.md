# 🔧 CÓMO INSERTAR DATOS DE PRUEBA PARA LOGIN

## Opción 1: Usando pgAdmin (Recomendado)

1. **Abre pgAdmin** en tu navegador (usualmente en `http://localhost:5050`)
2. **Conecta a tu servidor de PostgreSQL** si no está conectado
3. **Abre la base de datos `gym_db`** (o el nombre que uses)
4. En el menú superior, selecciona **Tools → Query Tool**
5. **Copia y pega el contenido de:** `database/simple_insert.sql`
6. **Presiona F5 o el botón ▶ "Execute"**
7. Deberías ver un mensaje de "Empleados insertados:"

---

## Opción 2: Usando DBeaver

1. **Abre DBeaver**
2. **Conecta a tu base de datos PostgreSQL**
3. Click derecho en la conexión → **SQL Editor → New SQL Script**
4. **Copia y pega el contenido de:** `database/simple_insert.sql`
5. **Presiona Ctrl+Enter** para ejecutar
6. Verifica la salida en la solapa de abajo

---

## Opción 3: Usando Línea de Comandos

Abre PowerShell y ejecuta:

```powershell
cd "c:\Doc. life\CLASES AUTONOMAS\progrmacion\Carpetas a VScode\Sistem_Proyect_Gym\gym-management-system\backend"
psql -U admin -d gym_db -f ..\database\simple_insert.sql
```

Cambia:
- `admin` por tu usuario de PostgreSQL
- `gym_db` por el nombre de tu base de datos

---

## ✅ Después de Insertar los Datos

Una vez completado, **prueba el login** con:

### Administrador
- **Cédula:** `1000000001`
- **Contraseña:** `admin123`

### Gerente
- **Cédula:** `1000000002`
- **Contraseña:** `gerente123`

### Recepcionista
- **Cédula:** `1000000003`
- **Contraseña:** `recepcionista123`

---

## ❌ Si Aún No Funciona

Si después de insertar los datos el login sigue sin funcionar:

1. **Abre la consola del navegador** (F12 → Console)
2. **Intentar hacer login** y observa el error
3. **Verifica en pgAdmin/DBeaver** que los datos están correctamente insertados:
   ```sql
   SELECT * FROM empleados WHERE cedula IN ('1000000001', '1000000002', '1000000003');
   ```

4. **Si ves los empleados**, el problema es en el frontend
5. **Si NO ves los empleados**, repite los pasos de inserción

---

## 🔐 Nota sobre Contraseñas

Las contraseñas se almacenan en **texto plano** por ahora (solo para desarrollo).

En **producción**, deberían estar encriptadas con **bcrypt** o similar.
