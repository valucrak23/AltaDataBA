# 🎭 API de Eventos Culturales Buenos Aires

## Datos del proyecto
- Nombre y Apellido: Agostina Cruz, Alfredo Cubillo, Valentina Ijelchuk
- Materia: Aplicaciones Híbridas
- Docente: Jhonatan Cruz
- Comisión: DWM4AP

API REST para gestionar eventos culturales, recitales y talleres en Buenos Aires.

## 🚀 Características

- **Gestión de usuarios** - Registro y autenticación de usuarios
- **Gestión de eventos** - Recitales, eventos culturales y talleres
- **Sistema de categorías** - Filtrado por tipo de evento (gastronomía, tecnología, visitas, teatro, etc.)
- **Información útil** - Cómo llegar, precios, alojamiento, recomendaciones

### 👥 Usuarios
- `GET /api/usuarios`
- `GET /api/usuarios/"id"` - Obtener usuario por ID
**Ejemplo de creación de usuario:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "password": "mipassword123"
}
```

### 🎭 Eventos
- `GET /api/eventos`
- `GET /api/eventos?q=rock` - Buscar por nombre
- `GET /api/eventos/"id"` - Obtener evento por ID

**Filtros disponibles para eventos:**
- `?q=Talleres` - Filtrar por nombre

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
- `GET /api/categorias`
- `GET /api/categorias?q=rock` - Buscar por nombre
- `GET /api/categorias/"id"` - Obtener categoría por ID

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
```- Futura Integración con Google Maps API
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