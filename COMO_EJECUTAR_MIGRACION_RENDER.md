# Cómo ejecutar la migración de colores desde Render

## 🚀 Opción 1: Usando el Endpoint API (Recomendado y más fácil)

Se ha creado un endpoint temporal en tu API para ejecutar la migración directamente desde Render.

### Pasos:

1. **Asegúrate de que tu aplicación esté desplegada en Render**

2. **Llama al endpoint** desde tu navegador o con curl:

   ```
   GET https://tu-app.render.com/api/migracion/color-eventos
   ```

   **Ejemplo con curl:**
   ```bash
   curl https://tu-app.render.com/api/migracion/color-eventos
   ```

   **Ejemplo desde el navegador:**
   - Abre tu navegador
   - Ve a: `https://tu-app.render.com/api/migracion/color-eventos`
   - Verás la respuesta con el resultado de la migración

3. **Respuesta esperada:**
   ```json
   {
     "msg": "✅ Migración completada exitosamente",
     "eventosActualizados": 5,
     "eventosActualizadosList": [
       {
         "id": "...",
         "titulo": "Concierto de Rock",
         "tipo": "recital",
         "color": "#ff6b6b"
       }
     ],
     "estadisticas": {
       "totalEventos": 10,
       "eventosConColor": 10,
       "eventosSinColor": 0
     }
   }
   ```

### ⚠️ Nota de Seguridad:

Después de ejecutar la migración, puedes **eliminar o proteger** este endpoint:

- **Eliminar**: Borra el archivo `routes/MigracionRouter.js` y su importación en `routes/index.js`
- **Proteger**: Agrega autenticación JWT antes de permitir la migración

---

## 🖥️ Opción 2: Usando el Shell de Render

Si prefieres ejecutar el script directamente desde el shell de Render:

### Pasos:

1. **Ve a tu dashboard de Render**
   - Entra a [dashboard.render.com](https://dashboard.render.com)

2. **Abre el Shell de tu servicio**
   - Click en tu servicio (Web Service)
   - Ve a la pestaña "Shell"
   - O usa el botón "Connect" / "Open Shell"

3. **Navega al directorio de tu proyecto** (si es necesario)
   ```bash
   cd /opt/render/project/src
   ```

4. **Ejecuta el script de migración**
   ```bash
   node migracion-color-eventos.js
   ```

5. **Verás la salida en la consola:**
   ```
   🔌 Conectando a la base de datos...
   ✅ Conectado a la base de datos
   📊 Encontrados 5 eventos sin color
     ✓ Actualizado: "Concierto de Rock" → Color: #ff6b6b
     ...
   ✅ Migración completada: 5 eventos actualizados
   ```

---

## 🌐 Opción 3: Desde MongoDB Atlas (Directamente)

Si tienes acceso a MongoDB Atlas, puedes ejecutar directamente en la base de datos:

### Pasos:

1. **Conéctate a MongoDB Atlas**
   - Ve a [cloud.mongodb.com](https://cloud.mongodb.com)
   - Click en "Browse Collections"
   - O usa MongoDB Compass

2. **Ejecuta el siguiente comando:**

   ```javascript
   // Asignar color azul por defecto a todos los eventos sin color
   db.eventos.updateMany(
       { 
           $or: [
               { color: { $exists: false } },
               { color: null },
               { color: "" }
           ]
       },
       [
           {
               $set: {
                   color: {
                       $switch: {
                           branches: [
                               { case: { $eq: ["$tipo", "recital"] }, then: "#ff6b6b" },
                               { case: { $eq: ["$tipo", "evento_cultural"] }, then: "#4ecdc4" },
                               { case: { $eq: ["$tipo", "taller"] }, then: "#ffe66d" }
                           ],
                           default: "#007bff"
                       }
                   }
               }
           }
       ]
   )
   ```

   O más simple, asignar un solo color:

   ```javascript
   // Dar color azul a todos los eventos que no tienen color
   db.eventos.updateMany(
       { color: { $exists: false } },
       { $set: { color: "#007bff" } }
   )
   ```

---

## 📋 Opción 4: Ejecutar Localmente (Si tienes acceso a la BD)

Si puedes ejecutar el script desde tu computadora local:

1. **Clona/descarga tu repositorio** (si no lo tienes)

2. **Asegúrate de tener las variables de entorno**
   - El archivo `.env` debe tener `URI_DB` con la conexión a MongoDB

3. **Ejecuta el script:**
   ```bash
   node migracion-color-eventos.js
   ```

---

## ✅ Verificación

Después de ejecutar la migración, verifica que funcionó:

### Opción A: Desde la API
```bash
GET https://tu-app.render.com/api/eventos
```
Revisa que los eventos tengan el campo `color` en la respuesta.

### Opción B: Desde MongoDB Atlas
Busca un evento y verifica que tenga el campo `color` con un valor hexadecimal.

### Opción C: Desde el Frontend
1. Ve a tu aplicación en Render
2. Ve a la sección de Eventos
3. Verifica que los badges tengan colores

---

## 🎯 Resumen de Opciones

| Opción | Dificultad | Recomendado para |
|--------|-----------|------------------|
| **Endpoint API** | ⭐ Muy Fácil | ✅ Todos (La más fácil) |
| **Shell de Render** | ⭐⭐ Fácil | Si necesitas ver logs detallados |
| **MongoDB Atlas** | ⭐⭐⭐ Medio | Si prefieres trabajar directamente con la BD |
| **Local** | ⭐ Fácil | Si tienes acceso local a la BD |

---

## 🚨 Importante

- El endpoint `/api/migracion/color-eventos` es **temporal**
- Después de usarlo, considera **eliminarlo o protegerlo con autenticación**
- La migración es **idempotente**: puedes ejecutarla múltiples veces sin problemas

---

## 🔒 Seguridad (Después de la Migración)

Una vez completada la migración, protege o elimina el endpoint:

### Proteger con JWT:

```javascript
// En MigracionRouter.js
import { verificarToken } from '../middleware/auth.js'; // Si tienes middleware de auth

router.get('/color-eventos', verificarToken, async (request, response) => {
    // ... código de migración
});
```

### O simplemente eliminar:

1. Borra el archivo `routes/MigracionRouter.js`
2. Elimina la línea `import migracionRouter from './MigracionRouter.js';` de `routes/index.js`
3. Elimina la línea `app.use('/api/migracion', migracionRouter);` de `routes/index.js`

