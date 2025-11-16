# 📝 Instrucciones para Insertar 15 Eventos y 3 Categorías

Se han creado dos archivos para insertar datos de ejemplo en tu base de datos:

1. **`insertar-datos-ejemplo.js`** - Script de Node.js (recomendado)
2. **`queries-mongodb-ejemplo.js`** - Queries MongoDB nativas

---

## 🚀 Opción 1: Script de Node.js (Recomendado)

### Pasos:

1. **Asegúrate de que tu archivo `.env` tenga la variable `URI_DB` configurada:**
   ```
   URI_DB=mongodb+srv://usuario:password@cluster.mongodb.net/database
   PORT=3000
   ```

2. **Ejecuta el script:**
   ```bash
   node insertar-datos-ejemplo.js
   ```

3. **El script hará automáticamente:**
   - ✅ Conectarse a MongoDB
   - ✅ Insertar 3 categorías nuevas
   - ✅ Insertar 15 eventos completos con toda la información
   - ✅ Asignar los IDs de categorías a los eventos
   - ✅ Mostrar un resumen de lo insertado

### Datos que se insertarán:

**3 Categorías:**
- 🎨 Arte y Cultura (#6f42c1)
- 💻 Tecnología e Innovación (#17a2b8)
- 🍷 Gastronomía y Vinos (#dc3545)

**15 Eventos (5 recitales, 7 eventos culturales, 3 talleres):**
- Festival de Rock Nacional
- Noche de Tango en San Telmo
- Concierto Acústico - Música Indie
- Exposición de Arte Contemporáneo
- Festival de Cine Independiente
- Noche de Museos Abiertos
- Feria de Artesanos en Plaza Serrano
- Taller de Programación Web Full Stack
- Taller de Inteligencia Artificial
- Workshop de UX/UI Design
- Taller de Cocina Italiana
- Degustación de Vinos Argentinos
- Feria Gastronómica en Puerto Madero
- Taller de Cerámica para Principiantes
- Festival de Música Electrónica
- Curso de Fotografía Digital

---

## 🗄️ Opción 2: Queries MongoDB Nativas

### Para ejecutar en MongoDB Compass o MongoDB Shell:

1. **Abre MongoDB Compass** o conecta a MongoDB Shell

2. **Selecciona tu base de datos** (la que uses en `URI_DB`)

3. **Ejecuta las queries del archivo `queries-mongodb-ejemplo.js`** en orden:

   - Primero ejecuta la inserción de categorías
   - Luego busca los IDs de las categorías (el script incluye el código)
   - Finalmente ejecuta la inserción de eventos usando esos IDs

### Pasos detallados:

```javascript
// 1. Insertar categorías
db.categorias.insertMany([...]); // Copiar del archivo queries-mongodb-ejemplo.js

// 2. Obtener IDs de categorías
var categoriaArte = db.categorias.findOne({nombre: "Arte y Cultura"});
var categoriaTecno = db.categorias.findOne({nombre: "Tecnología e Innovación"});
var categoriaGastro = db.categorias.findOne({nombre: "Gastronomía y Vinos"});

// 3. Insertar eventos (el script ya usa los IDs)
db.eventos.insertMany([...]); // Copiar del archivo queries-mongodb-ejemplo.js
```

---

## 📊 Verificar la Inserción

### Desde Node.js (después de ejecutar el script):
El script mostrará un resumen automático.

### Desde MongoDB:
```javascript
// Contar eventos y categorías
db.eventos.countDocuments();
db.categorias.countDocuments();

// Ver algunos eventos
db.eventos.find().limit(5).pretty();

// Ver categorías
db.categorias.find().pretty();
```

### Desde la API:
```bash
GET http://localhost:3000/api/eventos
GET http://localhost:3000/api/categorias
```

### Desde el Frontend:
Ve a tu aplicación y navega a las secciones de Eventos y Categorías.

---

## 📋 Detalles de los Datos

### Información Completa Incluida:

Cada evento tiene:
- ✅ Título y descripción detallada
- ✅ Tipo (recital, evento_cultural, taller)
- ✅ Categoría asignada
- ✅ Fecha y hora
- ✅ Ubicación con:
  - Nombre del lugar
  - Dirección completa
  - Coordenadas GPS (lat, lng)
- ✅ Precio:
  - Si es gratuito o no
  - Monto en ARS
- ✅ Información adicional:
  - Cómo llegar (transporte público)
  - Recomendaciones
  - Contacto
  - Capacidad
- ✅ Color personalizado según tipo
- ✅ Estado activo

Cada categoría tiene:
- ✅ Nombre
- ✅ Descripción
- ✅ Icono emoji
- ✅ Color hexadecimal
- ✅ Estado activa

---

## ⚠️ Notas Importantes

1. **Fechas**: Los eventos se programan para fechas en los próximos 2-3 meses desde la fecha actual

2. **IDs de Categorías**: Si usas el script de Node.js, los IDs se manejan automáticamente. Si usas queries MongoDB, asegúrate de obtener los IDs correctos

3. **Duplicados**: Si ejecutas el script múltiples veces, puede crear duplicados. Para evitarlo:
   ```javascript
   // Verificar si ya existen antes de insertar
   if (db.categorias.countDocuments({nombre: "Arte y Cultura"}) === 0) {
       // Insertar...
   }
   ```

4. **Base de Datos**: Asegúrate de estar usando la base de datos correcta en MongoDB

---

## 🔄 Si Quieres Eliminar los Datos Insertados

```javascript
// Eliminar eventos por título (ejemplo)
db.eventos.deleteMany({
    titulo: {
        $in: [
            "Festival de Rock Nacional",
            "Noche de Tango en San Telmo",
            // ... otros títulos
        ]
    }
});

// Eliminar categorías por nombre
db.categorias.deleteMany({
    nombre: {
        $in: ["Arte y Cultura", "Tecnología e Innovación", "Gastronomía y Vinos"]
    }
});
```

---

## ✅ Resumen

- **Archivo recomendado**: `insertar-datos-ejemplo.js`
- **Comando**: `node insertar-datos-ejemplo.js`
- **Resultado**: 3 categorías + 15 eventos completos con toda la información
- **Tiempo estimado**: 2-5 segundos

¡Listo para usar! 🚀

