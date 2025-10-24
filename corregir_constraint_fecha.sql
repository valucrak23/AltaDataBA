-- =====================================================
-- SCRIPT DE CORRECCIÓN PARA CONSTRAINT DE FECHA
-- Ejecutar este script si ya tienes las tablas creadas
-- =====================================================

-- 1. ELIMINAR EL CONSTRAINT PROBLEMÁTICO
-- =====================================================
ALTER TABLE api_eventos DROP CONSTRAINT IF EXISTS api_eventos_fecha_check;

-- 2. CREAR EL NUEVO CONSTRAINT MÁS FLEXIBLE
-- =====================================================
ALTER TABLE api_eventos ADD CONSTRAINT api_eventos_fecha_check 
CHECK (fecha >= '2020-01-01' AND fecha <= '2030-12-31');

-- 3. VERIFICAR QUE EL CONSTRAINT SE APLICÓ CORRECTAMENTE
-- =====================================================
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'api_eventos_fecha_check';

-- 4. PROBAR INSERTAR UN EVENTO CON FECHA PASADA (OPCIONAL)
-- =====================================================
-- Descomenta las siguientes líneas para probar:
/*
INSERT INTO api_eventos (titulo, descripcion, tipo, categoria_id, fecha, hora, ubicacion, precio) VALUES
(
    'Concierto de Rock Nacional',
    'Gran concierto con las mejores bandas de rock argentino',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Música' LIMIT 1),
    '2024-02-15',
    '21:00',
    '{"nombre": "Estadio Luna Park", "direccion": "Av. Corrientes 4200, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 5000, "moneda": "ARS"}'
);
*/

-- =====================================================
-- FIN DEL SCRIPT DE CORRECCIÓN
-- =====================================================
