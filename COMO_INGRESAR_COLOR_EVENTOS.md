# Cómo agregar el campo COLOR a eventos en la Base de Datos

## ✅ Cambios Realizados

Se ha agregado el campo `color` al modelo de Evento. Ahora puedes usar colores personalizados para cada evento.

---

## 🎨 Método 1: Desde el Frontend (Recomendado)

### Crear un nuevo evento con color:

1. Ve a la sección de **Eventos** en el frontend
2. Click en **"➕ Nuevo Evento"**
3. Completa todos los campos del formulario
4. En el campo **"Color"**, selecciona un color usando el selector de color
5. Click en **"Guardar"**

El color se guardará automáticamente en formato hexadecimal (ej: `#007bff`, `#ff6b6b`, `#28a745`)

### Editar el color de un evento existente:

1. Ve a la sección de **Eventos**
2. Click en **"✏️ Editar"** en el evento que quieres modificar
3. Cambia el color en el selector
4. Click en **"Guardar"**

---

## 🗄️ Método 2: Directamente en MongoDB Atlas

### Opción A: Usando MongoDB Compass o MongoDB Shell

```javascript
// Actualizar todos los eventos existentes con un color por defecto
db.eventos.updateMany(
    { color: { $exists: false } },
    { $set: { color: "#007bff" } }
)

// Actualizar un evento específico por ID
db.eventos.updateOne(
    { _id: ObjectId("TU_ID_DEL_EVENTO") },
    { $set: { color: "#ff6b6b" } }
)

// Insertar un nuevo evento con color
db.eventos.insertOne({
    titulo: "Mi Evento",
    descripcion: "Descripción del evento",
    tipo: "recital",
    categoria: ObjectId("ID_DE_CATEGORIA"),
    fecha: new Date("2024-03-15"),
    hora: "20:00",
    ubicacion: {
        nombre: "Luna Park",
        direccion: "Av. Corrientes 4200"
    },
    precio: {
        esGratuito: false,
        monto: 5000,
        moneda: "ARS"
    },
    color: "#ff6b6b",  // ← Campo de color
    activo: true
})
```

### Opción B: Usando una petición API (POST/PUT)

#### Crear evento con color:

```bash
POST http://localhost:3000/api/eventos
Content-Type: application/json

{
    "titulo": "Concierto de Rock",
    "descripcion": "Presentación de bandas",
    "tipo": "recital",
    "categoria": "ID_DE_CATEGORIA",
    "fecha": "2024-03-15",
    "hora": "20:00",
    "ubicacion": {
        "nombre": "Estadio",
        "direccion": "Calle 123"
    },
    "precio": {
        "esGratuito": false,
        "monto": 5000,
        "moneda": "ARS"
    },
    "color": "#28a745"  ← Campo de color (opcional, por defecto: #007bff)
}
```

#### Actualizar evento existente con color:

```bash
PUT http://localhost:3000/api/eventos/ID_DEL_EVENTO
Content-Type: application/json

{
    "color": "#dc3545"  ← Solo el color, o incluir otros campos
}
```

---

## 🎨 Valores de Color Disponibles

El campo `color` acepta valores en formato **hexadecimal**:

### Colores Predefinidos Sugeridos:

- `#007bff` - Azul (por defecto)
- `#28a745` - Verde
- `#dc3545` - Rojo
- `#ffc107` - Amarillo
- `#17a2b8` - Cian
- `#6f42c1` - Púrpura
- `#fd7e14` - Naranja
- `#e83e8c` - Rosa
- `#20c997` - Verde agua
- `#ff6b6b` - Rojo claro
- `#4ecdc4` - Turquesa
- `#ffe66d` - Amarillo claro

### Cómo obtener un color hexadecimal:

1. **Desde el selector de color del frontend**: Ya está implementado
2. **Desde un generador de colores online**: 
   - [HTML Color Codes](https://htmlcolorcodes.com/)
   - [Coolors](https://coolors.co/)
   - [Color Picker](https://www.w3schools.com/colors/colors_picker.asp)

3. **Código RGB a Hexadecimal**: 
   - RGB(0, 123, 255) = `#007bff`
   - Formato: `#RRGGBB` donde cada valor está en hexadecimal (00-FF)

---

## 📝 Estructura del Campo en la Base de Datos

```javascript
{
    "_id": ObjectId("..."),
    "titulo": "Mi Evento",
    "descripcion": "...",
    // ... otros campos ...
    "color": "#007bff",  // ← Campo agregado (String, formato hexadecimal)
    "activo": true,
    "fechaCreacion": ISODate("...")
}
```

---

## ✅ Validación

- **Formato**: Debe ser un string en formato hexadecimal (#RRGGBB)
- **Valor por defecto**: Si no se especifica, se usa `#007bff` (azul)
- **Ejemplos válidos**:
  - `#007bff` ✅
  - `#ff6b6b` ✅
  - `#28a745` ✅
  - `#fff` ❌ (formato corto no recomendado, usar formato completo)

---

## 🎯 Uso del Color en el Frontend

El color se muestra automáticamente:

1. **En la lista de eventos**: El badge del tipo de evento usa el color del evento
2. **En el formulario**: Hay un selector de color para elegir/editar
3. **Visualización**: Se aplica como `background-color` en el badge del tipo

### Ejemplo visual:

```
┌─────────────────────────────────┐
│ 🎵 Concierto de Rock            │
│ [Recital]  ← Color personalizado│
│                                 │
│ Descripción del evento...       │
└─────────────────────────────────┘
```

El badge `[Recital]` tendrá el color que hayas asignado al evento.

---

## 🔄 Migración de Eventos Existentes

Si ya tienes eventos en la base de datos **sin el campo color**, puedes agregarlo:

### Desde MongoDB Shell:

```javascript
// Dar color azul a todos los eventos que no tienen color
db.eventos.updateMany(
    { color: { $exists: false } },
    { $set: { color: "#007bff" } }
)
```

### Desde Node.js (script de migración):

```javascript
import mongoose from 'mongoose';
import Evento from './models/EventoModel.js';

// Conectar a la BD
mongoose.connect(process.env.URI_DB);

// Actualizar eventos sin color
await Evento.updateMany(
    { color: { $exists: false } },
    { $set: { color: "#007bff" } }
);

console.log('Migración completada');
```

---

## 📚 Resumen

1. ✅ **Modelo actualizado**: El campo `color` está en el modelo Evento
2. ✅ **Frontend actualizado**: Selector de color en el formulario
3. ✅ **Visualización**: El color se muestra en los badges de los eventos
4. ✅ **Valor por defecto**: `#007bff` si no se especifica

**Forma más fácil**: Usa el frontend para crear/editar eventos con color. ¡Es la forma más simple!

