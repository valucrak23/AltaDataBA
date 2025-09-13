# 🎭 API de Eventos Culturales Buenos Aires

## Datos del proyecto
- Nombre y Apellido: Agostina Cruz, Alfredo Cubillo, Valentina Ijelchuk
- Materia: Aplicaciones Híbridas 2
- Docente: Jhonatan Cruz
- Comisión: DWM4AP

API REST para gestionar eventos culturales, recitales y talleres en Buenos Aires.

## 🚀 Características

- **Gestión de usuarios** - Registro y autenticación de usuarios
- **Gestión de eventos** - Recitales, eventos culturales y talleres
- **Sistema de categorías** - Filtrado por tipo de evento (gastronomía, tecnología, visitas, teatro, etc.)
- **Integración con Google Maps** - Coordenadas y búsqueda por ubicación
- **Información útil** - Cómo llegar, precios, alojamiento, recomendaciones

## 🛠 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

## 📋 Tipos de Eventos

1. **🎵 Recitales** - Conciertos y presentaciones musicales
2. **🎨 Eventos Culturales** - Exposiciones, festivales, ferias
3. **📚 Talleres** - Cursos, workshops, capacitaciones

## ⚙️ Instalación

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno en un archivo `.env`
4. Ejecuta la aplicación: `npm start`

## 🔧 Variables de entorno

```env
URI_DB=mongodb://localhost:27017/eventos_culturales_bsas
PORT=3000
```

## 📡 Endpoints

### 👥 Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

**Ejemplo de creación de usuario:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "password": "mipassword123"
}
```

### 🎭 Eventos
- `GET /api/eventos` - Listar eventos (con filtros)
- `GET /api/eventos?q=rock` - Buscar por título/descripción
- `GET /api/eventos/ubicacion` - Buscar eventos por ubicación
- `GET /api/eventos/:id` - Obtener evento por ID
- `POST /api/eventos` - Crear evento
- `PUT /api/eventos/:id` - Actualizar evento
- `DELETE /api/eventos/:id` - Eliminar evento

**Filtros disponibles para eventos:**
- `?tipo=recital` - Filtrar por tipo
- `?categoria=id_categoria` - Filtrar por categoría
- `?activo=true` - Solo eventos activos
- `?fecha_desde=2024-01-01` - Desde fecha
- `?fecha_hasta=2024-12-31` - Hasta fecha

**Ejemplo de creación de evento:**
```json
{
  "titulo": "Concierto de Rock Nacional",
  "descripcion": "Presentación de las mejores bandas de rock argentino",
  "tipo": "recital",
  "categoria": "id_de_categoria_musica",
  "fecha": "2024-03-15",
  "hora": "20:00",
  "ubicacion": {
    "nombre": "Estadio Luna Park",
    "direccion": "Av. Corrientes 4200, CABA",
    "coordenadas": {
      "lat": -34.6037,
      "lng": -58.3816
    }
  },
  "precio": {
    "esGratuito": false,
    "monto": 5000,
    "moneda": "ARS"
  },
  "informacionAdicional": {
    "alojamiento": "Hoteles cercanos disponibles",
    "comoLlegar": "Subte línea B, estación Carlos Gardel",
    "recomendaciones": ["Llegar temprano", "Traer documento"],
    "contacto": "info@eventos.com",
    "capacidad": 5000
  }
}
```

### 🏷️ Categorías
- `GET /api/categorias` - Listar categorías
- `GET /api/categorias?q=rock` - Buscar por nombre/descripción
- `GET /api/categorias/:id` - Obtener categoría por ID
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

**Ejemplo de categoría:**
```json
{
  "nombre": "Gastronomía",
  "descripcion": "Eventos relacionados con comida y bebida",
  "icono": "🍽️",
  "color": "#ff6b6b"
}
```

## 🗺️ Integración con Google Maps

La API incluye coordenadas geográficas para cada evento, permitiendo:
- Visualización en mapas
- Búsqueda por proximidad
- Cálculo de distancias
- Integración con Google Maps API

**Búsqueda por ubicación:**
```
GET /api/eventos/ubicacion?lat=-34.6037&lng=-58.3816&radio=5000
```

## 📊 Estructura de la Base de Datos

### Usuario
- `nombre` - Nombre completo
- `email` - Email único
- `password` - Contraseña encriptada
- `fechaRegistro` - Fecha de creación

### Evento
- `titulo` - Título del evento
- `descripcion` - Descripción detallada
- `tipo` - recital, evento_cultural, taller
- `categoria` - Referencia a categoría
- `fecha` - Fecha del evento
- `hora` - Hora del evento
- `ubicacion` - Información de ubicación
- `precio` - Información de precios
- `informacionAdicional` - Datos útiles adicionales

### Categoría
- `nombre` - Nombre de la categoría
- `descripcion` - Descripción
- `icono` - Icono emoji
- `color` - Color hexadecimal

## 🚀 Scripts disponibles

- `npm start` - Iniciar servidor en modo producción
- `npm run dev` - Iniciar servidor en modo desarrollo con auto-reload

## 📝 Notas adicionales

- La API está optimizada para eventos en Buenos Aires
- Incluye validaciones de datos
- Manejo de errores robusto
- Respuestas en español
- Preparada para integración con apps móviles híbridas