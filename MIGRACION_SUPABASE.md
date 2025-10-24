# Migración de MongoDB a Supabase

## Cambios Realizados

### 1. Dependencias Actualizadas
- **Removido**: `mongoose` (MongoDB ODM)
- **Agregado**: `@supabase/supabase-js` (Cliente de Supabase)

### 2. Estructura de Archivos
- **Nuevo**: `config/supabase.js` - Configuración del cliente de Supabase
- **Nuevo**: `services/` - Servicios para manejar operaciones de base de datos
  - `UsuarioService.js` - Operaciones CRUD para usuarios
  - `CategoriaService.js` - Operaciones CRUD para categorías  
  - `EventoService.js` - Operaciones CRUD para eventos
- **Actualizado**: Todos los controladores ahora usan los servicios de Supabase

### 3. Variables de Entorno Requeridas

Crea un archivo `.env` con las siguientes variables:

```env
# Configuración de Supabase
SUPABASE_URL=tu_url_de_supabase_aqui
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui

# Puerto del servidor
PORT=3000
```

### 4. Esquema de Base de Datos en Supabase

**IMPORTANTE**: Todas las tablas tienen el prefijo `api_` para evitar conflictos con tu base de datos existente.

#### Tabla `api_usuarios`
```sql
CREATE TABLE api_usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `api_categorias`
```sql
CREATE TABLE api_categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    icono VARCHAR(255) DEFAULT '',
    color VARCHAR(7) DEFAULT '#007bff',
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `api_eventos`
```sql
CREATE TABLE api_eventos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN ('recital', 'evento_cultural', 'taller')) NOT NULL,
    categoria_id UUID REFERENCES api_categorias(id) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion JSONB NOT NULL,
    precio JSONB NOT NULL,
    informacion_adicional JSONB,
    imagen VARCHAR(500) DEFAULT '',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Instalación

1. Instala las nuevas dependencias:
```bash
npm install
```

2. Configura las variables de entorno en tu archivo `.env`

3. **Ejecuta el SQL de migración completo**:
```bash
# Copia y pega el contenido del archivo migracion_api_eventos.sql
# en tu cliente de PostgreSQL/Supabase
```

4. Ejecuta el servidor:
```bash
npm start
```

### 6. Cambios en la API

- Los IDs ahora son UUIDs en lugar de ObjectIds de MongoDB
- Las relaciones se manejan con `categoria_id` en lugar de `categoria`
- Los campos de fecha usan formato ISO string
- Los errores de duplicado ahora usan código `23505` (PostgreSQL)
- Los errores de "no encontrado" usan código `PGRST116` (Supabase)
- **Todas las tablas tienen prefijo `api_`**: `api_usuarios`, `api_categorias`, `api_eventos`

### 7. Funcionalidades Mantenidas

- ✅ CRUD completo para usuarios, categorías y eventos
- ✅ Búsqueda por texto
- ✅ Filtros por tipo, categoría, fecha, etc.
- ✅ Búsqueda por ubicación geográfica
- ✅ Validaciones de datos
- ✅ Manejo de errores
- ✅ Respuestas JSON consistentes

### 8. Ventajas de Supabase

- **Base de datos PostgreSQL**: Más robusta y escalable
- **API REST automática**: Generada automáticamente
- **Autenticación integrada**: Sistema de auth completo
- **Tiempo real**: Suscripciones en tiempo real
- **Dashboard web**: Interfaz gráfica para administrar datos
- **Escalabilidad**: Infraestructura gestionada

### 9. Archivos de Migración

- `migracion_api_eventos.sql` - Script SQL completo para crear todas las tablas, índices, datos iniciales y funciones auxiliares
- `corregir_constraint_fecha.sql` - Script para corregir el constraint de fecha si ya tienes las tablas creadas
- Incluye datos de ejemplo de categorías
- Incluye vistas útiles para consultas complejas
- Incluye función para búsqueda geográfica

### 10. Solución de Problemas

**Error de Constraint de Fecha:**
Si encuentras el error `ERROR: 23514` relacionado con `api_eventos_fecha_check`, ejecuta el script `corregir_constraint_fecha.sql` para corregir la restricción de fecha que es demasiado estricta.
