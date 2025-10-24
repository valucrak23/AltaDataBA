-- =====================================================
-- SQL DE MIGRACIÓN PARA API DE EVENTOS CULTURALES
-- Base de datos existente con prefijo api_
-- =====================================================

-- 1. CREAR TABLA DE CATEGORÍAS
-- =====================================================
CREATE TABLE IF NOT EXISTS api_categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    icono VARCHAR(255) DEFAULT '',
    color VARCHAR(7) DEFAULT '#007bff',
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para optimizar consultas
    CONSTRAINT api_categorias_nombre_check CHECK (length(nombre) > 0),
    CONSTRAINT api_categorias_color_check CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

-- Índices para api_categorias
CREATE INDEX IF NOT EXISTS idx_api_categorias_activa ON api_categorias(activa);
CREATE INDEX IF NOT EXISTS idx_api_categorias_nombre ON api_categorias(nombre);

-- 2. CREAR TABLA DE USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS api_usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para validar email
    CONSTRAINT api_usuarios_email_check CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT api_usuarios_password_check CHECK (length(password) >= 6),
    CONSTRAINT api_usuarios_nombre_check CHECK (length(nombre) > 0)
);

-- Índices para api_usuarios
CREATE INDEX IF NOT EXISTS idx_api_usuarios_email ON api_usuarios(email);
CREATE INDEX IF NOT EXISTS idx_api_usuarios_nombre ON api_usuarios(nombre);

-- 3. CREAR TABLA DE EVENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS api_eventos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('recital', 'evento_cultural', 'taller')),
    categoria_id UUID NOT NULL REFERENCES api_categorias(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion JSONB NOT NULL,
    precio JSONB NOT NULL,
    informacion_adicional JSONB,
    imagen VARCHAR(500) DEFAULT '',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints para validar datos
    CONSTRAINT api_eventos_titulo_check CHECK (length(titulo) > 0),
    CONSTRAINT api_eventos_descripcion_check CHECK (length(descripcion) > 0),
    CONSTRAINT api_eventos_fecha_check CHECK (fecha >= '2020-01-01' AND fecha <= '2030-12-31'),
    CONSTRAINT api_eventos_ubicacion_check CHECK (ubicacion ? 'nombre' AND ubicacion ? 'direccion')
);

-- Índices para api_eventos
CREATE INDEX IF NOT EXISTS idx_api_eventos_categoria ON api_eventos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_api_eventos_tipo ON api_eventos(tipo);
CREATE INDEX IF NOT EXISTS idx_api_eventos_fecha ON api_eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_api_eventos_activo ON api_eventos(activo);
CREATE INDEX IF NOT EXISTS idx_api_eventos_titulo ON api_eventos USING gin(to_tsvector('spanish', titulo));

-- Índice compuesto para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_api_eventos_activo_fecha ON api_eventos(activo, fecha);

-- 4. INSERTAR DATOS INICIALES DE CATEGORÍAS
-- =====================================================
INSERT INTO api_categorias (nombre, descripcion, icono, color) VALUES
('Música', 'Recitales, conciertos y eventos musicales', '🎵', '#e74c3c'),
('Arte', 'Exposiciones, galerías y eventos artísticos', '🎨', '#9b59b6'),
('Teatro', 'Obras de teatro, musicales y espectáculos', '🎭', '#f39c12'),
('Danza', 'Shows de danza, ballet y espectáculos de baile', '💃', '#e67e22'),
('Literatura', 'Presentaciones de libros, lecturas y talleres literarios', '📚', '#2ecc71'),
('Cine', 'Proyecciones, festivales y eventos cinematográficos', '🎬', '#34495e'),
('Talleres', 'Talleres educativos y de desarrollo personal', '🔧', '#1abc9c'),
('Gastronomía', 'Eventos culinarios, degustaciones y talleres de cocina', '🍽️', '#e74c3c'),
('Deportes', 'Eventos deportivos y actividades físicas', '⚽', '#27ae60'),
('Tecnología', 'Conferencias tech, hackathons y eventos digitales', '💻', '#3498db')
ON CONFLICT (nombre) DO NOTHING;

-- 5. INSERTAR USUARIOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Descomenta las siguientes líneas si quieres datos de ejemplo
/*
INSERT INTO api_usuarios (nombre, email, password) VALUES
('Juan Pérez', 'juan@ejemplo.com', 'password123'),
('María García', 'maria@ejemplo.com', 'password123'),
('Carlos López', 'carlos@ejemplo.com', 'password123')
ON CONFLICT (email) DO NOTHING;
*/

-- 6. INSERTAR EVENTOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Descomenta las siguientes líneas si quieres datos de ejemplo
/*
INSERT INTO api_eventos (titulo, descripcion, tipo, categoria_id, fecha, hora, ubicacion, precio, informacion_adicional, imagen) VALUES
(
    'Concierto de Rock Nacional',
    'Gran concierto con las mejores bandas de rock argentino',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Música' LIMIT 1),
    '2024-02-15',
    '21:00',
    '{"nombre": "Estadio Luna Park", "direccion": "Av. Corrientes 4200, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 5000, "moneda": "ARS"}',
    '{"capacidad": 8000, "contacto": "info@lunapark.com.ar", "recomendaciones": ["Llegar 30 min antes", "No llevar cámaras profesionales"]}',
    'https://ejemplo.com/imagen-concierto.jpg'
),
(
    'Taller de Pintura al Óleo',
    'Aprende las técnicas básicas de pintura al óleo',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Arte' LIMIT 1),
    '2024-02-20',
    '18:00',
    '{"nombre": "Centro Cultural Recoleta", "direccion": "Junín 1930, CABA", "coordenadas": {"lat": -34.5875, "lng": -58.3931}}',
    '{"esGratuito": false, "monto": 3000, "moneda": "ARS"}',
    '{"capacidad": 20, "contacto": "talleres@centroculturalrecoleta.org", "recomendaciones": ["Traer delantal", "Materiales incluidos"]}',
    'https://ejemplo.com/imagen-taller.jpg'
)
ON CONFLICT DO NOTHING;
*/

-- 7. CREAR FUNCIONES AUXILIARES (OPCIONAL)
-- =====================================================

-- Función para buscar eventos por ubicación (requiere extensión PostGIS para mejor precisión)
CREATE OR REPLACE FUNCTION api_buscar_eventos_por_ubicacion(
    lat_param DOUBLE PRECISION,
    lng_param DOUBLE PRECISION,
    radio_metros INTEGER DEFAULT 5000
)
RETURNS TABLE (
    id UUID,
    titulo VARCHAR,
    descripcion TEXT,
    tipo VARCHAR,
    fecha DATE,
    hora TIME,
    ubicacion JSONB,
    precio JSONB,
    activo BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.titulo,
        e.descripcion,
        e.tipo,
        e.fecha,
        e.hora,
        e.ubicacion,
        e.precio,
        e.activo
    FROM api_eventos e
    WHERE e.activo = true
    AND (
        -- Cálculo básico de distancia (para mejor precisión usar PostGIS)
        (6371000 * acos(
            cos(radians(lat_param)) * 
            cos(radians((e.ubicacion->>'lat')::DOUBLE PRECISION)) * 
            cos(radians((e.ubicacion->>'lng')::DOUBLE PRECISION) - radians(lng_param)) + 
            sin(radians(lat_param)) * 
            sin(radians((e.ubicacion->>'lat')::DOUBLE PRECISION))
        )) <= radio_metros
    )
    ORDER BY e.fecha;
END;
$$ LANGUAGE plpgsql;

-- 8. CREAR VISTAS ÚTILES (OPCIONAL)
-- =====================================================

-- Vista para eventos con información de categoría
CREATE OR REPLACE VIEW api_vista_eventos_completos AS
SELECT 
    e.id,
    e.titulo,
    e.descripcion,
    e.tipo,
    e.fecha,
    e.hora,
    e.ubicacion,
    e.precio,
    e.informacion_adicional,
    e.imagen,
    e.activo,
    e.fecha_creacion,
    c.nombre as categoria_nombre,
    c.descripcion as categoria_descripcion,
    c.icono as categoria_icono,
    c.color as categoria_color
FROM api_eventos e
JOIN api_categorias c ON e.categoria_id = c.id;

-- Vista para estadísticas
CREATE OR REPLACE VIEW api_vista_estadisticas AS
SELECT 
    (SELECT COUNT(*) FROM api_usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM api_categorias WHERE activa = true) as categorias_activas,
    (SELECT COUNT(*) FROM api_eventos WHERE activo = true) as eventos_activos,
    (SELECT COUNT(*) FROM api_eventos WHERE fecha >= CURRENT_DATE) as eventos_futuros;

-- 9. CONFIGURAR PERMISOS (AJUSTAR SEGÚN TU CONFIGURACIÓN)
-- =====================================================

-- Habilitar RLS (Row Level Security) si es necesario
-- ALTER TABLE api_usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE api_categorias ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE api_eventos ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas (ajustar según tus necesidades)
-- CREATE POLICY "api_usuarios_select_policy" ON api_usuarios FOR SELECT USING (true);
-- CREATE POLICY "api_categorias_select_policy" ON api_categorias FOR SELECT USING (true);
-- CREATE POLICY "api_eventos_select_policy" ON api_eventos FOR SELECT USING (true);

-- 10. COMENTARIOS EN TABLAS Y COLUMNAS
-- =====================================================

COMMENT ON TABLE api_usuarios IS 'Tabla de usuarios del sistema de eventos culturales';
COMMENT ON TABLE api_categorias IS 'Categorías de eventos culturales disponibles';
COMMENT ON TABLE api_eventos IS 'Eventos culturales, recitales y talleres';

COMMENT ON COLUMN api_usuarios.email IS 'Email único del usuario';
COMMENT ON COLUMN api_usuarios.password IS 'Contraseña del usuario (hash)';
COMMENT ON COLUMN api_eventos.ubicacion IS 'Información de ubicación en formato JSON';
COMMENT ON COLUMN api_eventos.precio IS 'Información de precios en formato JSON';
COMMENT ON COLUMN api_eventos.informacion_adicional IS 'Información adicional del evento en formato JSON';

-- =====================================================
-- FIN DEL SCRIPT DE MIGRACIÓN
-- =====================================================

-- Para verificar que todo se creó correctamente, ejecuta:
-- SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'api_%';
-- SELECT * FROM api_vista_estadisticas;
