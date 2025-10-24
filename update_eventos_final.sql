-- Query corregida basada en la estructura real de api_eventos
-- Los campos recomendaciones y contacto están en informacion_adicional (JSONB)

-- 1. Actualizar eventos que no tienen ubicación completa
UPDATE api_eventos 
SET ubicacion = jsonb_build_object(
    'nombre', COALESCE(ubicacion->>'nombre', 'Centro Cultural'),
    'direccion', COALESCE(ubicacion->>'direccion', 'Av. Corrientes 1234, CABA'),
    'coordenadas', jsonb_build_object(
        'lat', COALESCE((ubicacion->'coordenadas'->>'lat')::numeric, -34.6037),
        'lng', COALESCE((ubicacion->'coordenadas'->>'lng')::numeric, -58.3816)
    )
)
WHERE ubicacion IS NULL OR ubicacion = '{}'::jsonb;

-- 2. Actualizar eventos que no tienen información adicional completa
UPDATE api_eventos 
SET informacion_adicional = jsonb_build_object(
    'recomendaciones', COALESCE(informacion_adicional->>'recomendaciones', 'Llegar 15 minutos antes, traer documento de identidad'),
    'contacto', COALESCE(informacion_adicional->>'contacto', 'info@eventos.com')
)
WHERE informacion_adicional IS NULL OR informacion_adicional = '{}'::jsonb;

-- 3. Actualizar eventos que no tienen precio definido correctamente
UPDATE api_eventos 
SET precio = jsonb_build_object(
    'esGratuito', COALESCE((precio->>'esGratuito')::boolean, true),
    'monto', COALESCE((precio->>'monto')::numeric, 0),
    'moneda', COALESCE(precio->>'moneda', 'ARS')
)
WHERE precio IS NULL OR precio = '{}'::jsonb;

-- 4. Actualizar eventos que no tienen hora
UPDATE api_eventos 
SET hora = COALESCE(hora, '20:00'::time)
WHERE hora IS NULL;

-- 5. Actualizar eventos que no tienen tipo específico
UPDATE api_eventos 
SET tipo = COALESCE(tipo, 'evento_cultural')
WHERE tipo IS NULL OR tipo = '';

-- 6. Actualizar eventos que no tienen categoría asignada
UPDATE api_eventos 
SET categoria_id = (
    SELECT id FROM api_categorias 
    WHERE nombre ILIKE '%general%' OR nombre ILIKE '%otros%'
    LIMIT 1
)
WHERE categoria_id IS NULL;

-- 7. Si no hay categoría "General", crear una y asignarla
INSERT INTO api_categorias (nombre, descripcion, icono, color, activa, fecha_creacion)
SELECT 'General', 'Eventos generales sin categoría específica', '🎭', '#6c757d', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM api_categorias WHERE nombre = 'General');

-- 8. Asignar la categoría General a eventos sin categoría
UPDATE api_eventos 
SET categoria_id = (SELECT id FROM api_categorias WHERE nombre = 'General' LIMIT 1)
WHERE categoria_id IS NULL;

-- 9. Actualizar eventos con fechas muy antiguas o futuras
UPDATE api_eventos 
SET fecha = CURRENT_DATE + INTERVAL '1 day'
WHERE fecha < '2020-01-01' OR fecha > '2030-12-31';

-- 10. Actualizar eventos sin descripción
UPDATE api_eventos 
SET descripcion = COALESCE(descripcion, 'Evento cultural en Buenos Aires. Más información disponible en el lugar.')
WHERE descripcion IS NULL OR descripcion = '';

-- 11. Actualizar eventos sin título
UPDATE api_eventos 
SET titulo = COALESCE(titulo, 'Evento Cultural')
WHERE titulo IS NULL OR titulo = '';

-- 12. Marcar todos los eventos como activos si no están marcados
UPDATE api_eventos 
SET activo = COALESCE(activo, true)
WHERE activo IS NULL;

-- 13. Agregar fecha de creación si no existe
UPDATE api_eventos 
SET fecha_creacion = COALESCE(fecha_creacion, NOW())
WHERE fecha_creacion IS NULL;

-- 14. Agregar imagen por defecto si no existe
UPDATE api_eventos 
SET imagen = COALESCE(imagen, 'https://via.placeholder.com/400x300/007bff/ffffff?text=Evento+Cultural')
WHERE imagen IS NULL OR imagen = '';

-- Verificar resultados finales
SELECT 
    COUNT(*) as total_eventos,
    COUNT(CASE WHEN ubicacion IS NOT NULL AND ubicacion != '{}'::jsonb THEN 1 END) as con_ubicacion,
    COUNT(CASE WHEN informacion_adicional IS NOT NULL AND informacion_adicional != '{}'::jsonb THEN 1 END) as con_info_adicional,
    COUNT(CASE WHEN precio IS NOT NULL AND precio != '{}'::jsonb THEN 1 END) as con_precio,
    COUNT(CASE WHEN hora IS NOT NULL THEN 1 END) as con_hora,
    COUNT(CASE WHEN categoria_id IS NOT NULL THEN 1 END) as con_categoria,
    COUNT(CASE WHEN activo = true THEN 1 END) as activos,
    COUNT(CASE WHEN imagen IS NOT NULL AND imagen != '' THEN 1 END) as con_imagen
FROM api_eventos;

-- Mostrar algunos ejemplos de eventos actualizados
SELECT 
    titulo,
    tipo,
    fecha,
    hora,
    ubicacion->>'nombre' as lugar,
    precio->>'esGratuito' as es_gratuito,
    informacion_adicional->>'contacto' as contacto,
    activo
FROM api_eventos 
LIMIT 5;
