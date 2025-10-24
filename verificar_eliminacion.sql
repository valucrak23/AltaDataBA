-- Verificar si el evento realmente se eliminó
SELECT COUNT(*) as total_eventos FROM api_eventos;

-- Buscar específicamente el evento que intentamos eliminar
SELECT id, titulo FROM api_eventos WHERE id = 'd393be5e-4b21-47b1-87bc-8cfcbdc3d2ed';
