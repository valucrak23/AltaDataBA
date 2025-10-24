-- Query para actualizar eventos con datos faltantes
-- Esta query actualiza eventos existentes con información adicional

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

-- 2. Actualizar eventos que no tienen información adicional
UPDATE api_eventos 
SET recomendaciones = COALESCE(recomendaciones, 'Llegar 15 minutos antes, traer documento de identidad'),
    contacto = COALESCE(contacto, 'info@eventos.com')
WHERE recomendaciones IS NULL OR contacto IS NULL;

-- 3. Actualizar eventos que no tienen precio definido
UPDATE api_eventos 
SET es_gratuito = COALESCE(es_gratuito, true),
    precio = COALESCE(precio, 0)
WHERE es_gratuito IS NULL OR precio IS NULL;

-- 4. Actualizar eventos que no tienen hora
UPDATE api_eventos 
SET hora = COALESCE(hora, '20:00')
WHERE hora IS NULL OR hora = '';

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
SET activo = true
WHERE activo IS NULL;

-- 13. Agregar fecha de creación si no existe
UPDATE api_eventos 
SET fecha_creacion = COALESCE(fecha_creacion, NOW())
WHERE fecha_creacion IS NULL;

-- Verificar resultados
SELECT 
    COUNT(*) as total_eventos,
    COUNT(CASE WHEN ubicacion IS NOT NULL THEN 1 END) as con_ubicacion,
    COUNT(CASE WHEN recomendaciones IS NOT NULL THEN 1 END) as con_recomendaciones,
    COUNT(CASE WHEN contacto IS NOT NULL THEN 1 END) as con_contacto,
    COUNT(CASE WHEN es_gratuito IS NOT NULL THEN 1 END) as con_precio_definido,
    COUNT(CASE WHEN hora IS NOT NULL THEN 1 END) as con_hora,
    COUNT(CASE WHEN categoria_id IS NOT NULL THEN 1 END) as con_categoria
FROM api_eventos;
