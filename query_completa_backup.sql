-- =====================================================
-- QUERY COMPLETA CON TODOS LOS DATOS DE LA BD
-- Por si algún mogólico borra todo
-- =====================================================

-- 1. ELIMINAR DATOS EXISTENTES (OPCIONAL)
-- =====================================================
-- Descomenta estas líneas si quieres limpiar todo antes de insertar
-- DELETE FROM api_eventos;
-- DELETE FROM api_usuarios;
-- DELETE FROM api_categorias;

-- 2. INSERTAR TODAS LAS CATEGORÍAS (40 CATEGORÍAS)
-- =====================================================
INSERT INTO api_categorias (nombre, descripcion, icono, color) VALUES
-- Categorías originales
('Música', 'Recitales, conciertos y eventos musicales', '🎵', '#e74c3c'),
('Arte', 'Exposiciones, galerías y eventos artísticos', '🎨', '#9b59b6'),
('Teatro', 'Obras de teatro, musicales y espectáculos', '🎭', '#f39c12'),
('Danza', 'Shows de danza, ballet y espectáculos de baile', '💃', '#e67e22'),
('Literatura', 'Presentaciones de libros, lecturas y talleres literarios', '📚', '#2ecc71'),
('Cine', 'Proyecciones, festivales y eventos cinematográficos', '🎬', '#34495e'),
('Talleres', 'Talleres educativos y de desarrollo personal', '🔧', '#1abc9c'),
('Gastronomía', 'Eventos culinarios, degustaciones y talleres de cocina', '🍽️', '#e74c3c'),
('Deportes', 'Eventos deportivos y actividades físicas', '⚽', '#27ae60'),
('Tecnología', 'Conferencias tech, hackathons y eventos digitales', '💻', '#3498db'),

-- Categorías adicionales
('Fotografía', 'Exposiciones fotográficas y talleres de fotografía', '📸', '#8e44ad'),
('Escultura', 'Exposiciones de esculturas y talleres de modelado', '🗿', '#95a5a6'),
('Arte Digital', 'Exposiciones de arte digital y NFT', '💻', '#3498db'),
('Música Clásica', 'Conciertos de música clásica y sinfónica', '🎼', '#2c3e50'),
('Jazz', 'Conciertos de jazz y jam sessions', '🎷', '#e67e22'),
('Rock', 'Conciertos de rock nacional e internacional', '🎸', '#e74c3c'),
('Pop', 'Conciertos de música pop y mainstream', '🎤', '#f39c12'),
('Electrónica', 'Festivales de música electrónica y DJ sets', '🎧', '#9b59b6'),
('Folk', 'Conciertos de música folklórica', '🪕', '#27ae60'),
('Reggae', 'Conciertos de reggae y música jamaicana', '🌿', '#16a085'),
('Comedia', 'Shows de stand-up comedy y humor', '😂', '#f1c40f'),
('Magia', 'Shows de magia e ilusionismo', '🎩', '#34495e'),
('Circo', 'Espectáculos circenses y acrobacias', '🎪', '#e67e22'),
('Danza Contemporánea', 'Shows de danza contemporánea', '💃', '#e91e63'),
('Flamenco', 'Shows de flamenco y danza española', '🌹', '#c0392b'),
('Salsa', 'Clases y shows de salsa', '🌶️', '#d35400'),
('Tango', 'Clases y milongas de tango', '🌹', '#2c3e50'),
('Hip Hop', 'Shows de hip hop y rap', '🎤', '#8e44ad'),
('Breakdance', 'Competencias y shows de breakdance', '🤸', '#f39c12'),
('Ballet', 'Presentaciones de ballet clásico', '🩰', '#ecf0f1'),
('Poesía', 'Recitales de poesía y spoken word', '📝', '#95a5a6'),
('Cuentacuentos', 'Sesiones de cuentacuentos para niños', '📚', '#f39c12'),
('Debate', 'Debates públicos y charlas', '🗣️', '#34495e'),
('Filosofía', 'Charla sobre filosofía y pensamiento', '🤔', '#7f8c8d'),
('Historia', 'Charla sobre historia argentina', '📜', '#8b4513'),
('Ciencia', 'Charla sobre ciencia y tecnología', '🔬', '#3498db'),
('Medicina', 'Charla sobre salud y medicina', '⚕️', '#e74c3c'),
('Psicología', 'Charla sobre psicología y bienestar', '🧠', '#9b59b6'),
('Arquitectura', 'Charla sobre arquitectura y diseño', '🏗️', '#95a5a6'),
('Medio Ambiente', 'Charla sobre ecología y sostenibilidad', '🌱', '#27ae60')
ON CONFLICT (nombre) DO NOTHING;

-- 3. INSERTAR TODOS LOS USUARIOS (40 USUARIOS)
-- =====================================================
INSERT INTO api_usuarios (nombre, email, password) VALUES
-- Usuarios originales
('Juan Pérez', 'juan@ejemplo.com', 'password123'),
('María García', 'maria@ejemplo.com', 'password123'),
('Carlos López', 'carlos@ejemplo.com', 'password123'),

-- Usuarios adicionales
('Ana García', 'ana.garcia@email.com', 'password123'),
('Carlos López', 'carlos.lopez@email.com', 'password123'),
('María Rodríguez', 'maria.rodriguez@email.com', 'password123'),
('José Martínez', 'jose.martinez@email.com', 'password123'),
('Laura Fernández', 'laura.fernandez@email.com', 'password123'),
('Diego González', 'diego.gonzalez@email.com', 'password123'),
('Sofía Pérez', 'sofia.perez@email.com', 'password123'),
('Miguel Sánchez', 'miguel.sanchez@email.com', 'password123'),
('Valentina Torres', 'valentina.torres@email.com', 'password123'),
('Sebastián Ramírez', 'sebastian.ramirez@email.com', 'password123'),
('Camila Flores', 'camila.flores@email.com', 'password123'),
('Nicolás Herrera', 'nicolas.herrera@email.com', 'password123'),
('Isabella Morales', 'isabella.morales@email.com', 'password123'),
('Matías Jiménez', 'matias.jimenez@email.com', 'password123'),
('Martina Ruiz', 'martina.ruiz@email.com', 'password123'),
('Santiago Díaz', 'santiago.diaz@email.com', 'password123'),
('Agustina Vargas', 'agustina.vargas@email.com', 'password123'),
('Facundo Castro', 'facundo.castro@email.com', 'password123'),
('Catalina Romero', 'catalina.romero@email.com', 'password123'),
('Thiago Aguilar', 'thiago.aguilar@email.com', 'password123'),
('Emilia Silva', 'emilia.silva@email.com', 'password123'),
('Benjamín Mendoza', 'benjamin.mendoza@email.com', 'password123'),
('Delfina Guerrero', 'delfina.guerrero@email.com', 'password123'),
('Maximiliano Vega', 'maximiliano.vega@email.com', 'password123'),
('Renata Castillo', 'renata.castillo@email.com', 'password123'),
('Leonardo Navarro', 'leonardo.navarro@email.com', 'password123'),
('Constanza Peña', 'constanza.pena@email.com', 'password123'),
('Ignacio Rojas', 'ignacio.rojas@email.com', 'password123'),
('Antonella Campos', 'antonella.campos@email.com', 'password123'),
('Tomás Espinoza', 'tomas.espinoza@email.com', 'password123'),
('Lucía Morales', 'lucia.morales@email.com', 'password123'),
('Alejandro Ruiz', 'alejandro.ruiz@email.com', 'password123'),
('Paula Herrera', 'paula.herrera@email.com', 'password123'),
('Gabriel Torres', 'gabriel.torres@email.com', 'password123'),
('Valeria Castro', 'valeria.castro@email.com', 'password123'),
('Rodrigo Silva', 'rodrigo.silva@email.com', 'password123')
ON CONFLICT (email) DO NOTHING;

-- 4. INSERTAR TODOS LOS EVENTOS (40 EVENTOS)
-- =====================================================
INSERT INTO api_eventos (titulo, descripcion, tipo, categoria_id, fecha, hora, ubicacion, precio, informacion_adicional, imagen) VALUES
-- Eventos originales
(
    'Concierto de Rock Nacional',
    'Gran concierto con las mejores bandas de rock argentino',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Rock' LIMIT 1),
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
),

-- Eventos adicionales
(
    'Festival de Jazz en Palermo',
    'Gran festival de jazz con artistas nacionales e internacionales',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Jazz' LIMIT 1),
    '2024-03-15',
    '20:00',
    '{"nombre": "Parque 3 de Febrero", "direccion": "Av. del Libertador 4100, CABA", "coordenadas": {"lat": -34.5731, "lng": -58.4011}}',
    '{"esGratuito": false, "monto": 8000, "moneda": "ARS"}',
    '{"capacidad": 5000, "contacto": "info@jazzpalermo.com", "recomendaciones": ["Llevar mantas", "No se permite comida"]}',
    'https://ejemplo.com/jazz-festival.jpg'
),
(
    'Taller de Fotografía Digital',
    'Aprende técnicas avanzadas de fotografía digital',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Fotografía' LIMIT 1),
    '2024-03-20',
    '18:30',
    '{"nombre": "Centro Cultural San Martín", "direccion": "Sarmiento 1551, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 4500, "moneda": "ARS"}',
    '{"capacidad": 25, "contacto": "talleres@ccgsm.gov.ar", "recomendaciones": ["Traer cámara propia", "Material incluido"]}',
    'https://ejemplo.com/taller-fotografia.jpg'
),
(
    'Exposición de Arte Digital',
    'Muestra de arte digital y NFT de artistas emergentes',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Arte Digital' LIMIT 1),
    '2024-03-25',
    '19:00',
    '{"nombre": "MALBA", "direccion": "Av. Figueroa Alcorta 3415, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 2000, "moneda": "ARS"}',
    '{"capacidad": 200, "contacto": "info@malba.org.ar", "recomendaciones": ["Reservar entrada", "Duración: 2 horas"]}',
    'https://ejemplo.com/arte-digital.jpg'
),
(
    'Concierto de Música Clásica',
    'Orquesta Sinfónica de Buenos Aires presenta Beethoven',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Música Clásica' LIMIT 1),
    '2024-04-01',
    '20:30',
    '{"nombre": "Teatro Colón", "direccion": "Cerrito 628, CABA", "coordenadas": {"lat": -34.6012, "lng": -58.3836}}',
    '{"esGratuito": false, "monto": 12000, "moneda": "ARS"}',
    '{"capacidad": 2500, "contacto": "info@teatrocolon.org.ar", "recomendaciones": ["Vestimenta formal", "Llegar 30 min antes"]}',
    'https://ejemplo.com/concierto-clasico.jpg'
),
(
    'Show de Stand-up Comedy',
    'Los mejores comediantes de Buenos Aires',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Comedia' LIMIT 1),
    '2024-04-05',
    '21:00',
    '{"nombre": "Comedy Central Live", "direccion": "Av. Corrientes 1234, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 3500, "moneda": "ARS"}',
    '{"capacidad": 300, "contacto": "info@comedycentral.com", "recomendaciones": ["Mayores de 18 años", "No grabar"]}',
    'https://ejemplo.com/comedy-show.jpg'
),
(
    'Taller de Escultura en Arcilla',
    'Aprende técnicas básicas de escultura',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Escultura' LIMIT 1),
    '2024-04-10',
    '17:00',
    '{"nombre": "Taller de Arte Barracas", "direccion": "Av. Montes de Oca 123, CABA", "coordenadas": {"lat": -34.6408, "lng": -58.3731}}',
    '{"esGratuito": false, "monto": 3200, "moneda": "ARS"}',
    '{"capacidad": 15, "contacto": "taller@barracasarte.com", "recomendaciones": ["Traer delantal", "Material incluido"]}',
    'https://ejemplo.com/taller-escultura.jpg'
),
(
    'Festival de Rock Nacional',
    'Las mejores bandas de rock argentino',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Rock' LIMIT 1),
    '2024-04-15',
    '19:00',
    '{"nombre": "Estadio Obras", "direccion": "Av. del Libertador 7395, CABA", "coordenadas": {"lat": -34.5731, "lng": -58.4011}}',
    '{"esGratuito": false, "monto": 15000, "moneda": "ARS"}',
    '{"capacidad": 3000, "contacto": "info@estadioobras.com", "recomendaciones": ["No cámaras profesionales", "Estacionamiento limitado"]}',
    'https://ejemplo.com/rock-festival.jpg'
),
(
    'Clase de Salsa para Principiantes',
    'Aprende los pasos básicos de salsa',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Salsa' LIMIT 1),
    '2024-04-20',
    '19:30',
    '{"nombre": "Escuela de Baile Latino", "direccion": "Av. Santa Fe 1234, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 2800, "moneda": "ARS"}',
    '{"capacidad": 20, "contacto": "info@latinodance.com", "recomendaciones": ["Venir con ropa cómoda", "No se requiere pareja"]}',
    'https://ejemplo.com/clase-salsa.jpg'
),
(
    'Recital de Poesía',
    'Poetas emergentes presentan sus obras',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Poesía' LIMIT 1),
    '2024-04-25',
    '20:00',
    '{"nombre": "Casa de la Poesía", "direccion": "Av. Corrientes 1234, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 80, "contacto": "info@casapoesia.org", "recomendaciones": ["Llegar temprano", "Entrada libre"]}',
    'https://ejemplo.com/recital-poesia.jpg'
),
(
    'Show de Magia Familiar',
    'Espectáculo de magia para toda la familia',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Magia' LIMIT 1),
    '2024-05-01',
    '16:00',
    '{"nombre": "Teatro del Abasto", "direccion": "Av. Corrientes 3247, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 4000, "moneda": "ARS"}',
    '{"capacidad": 400, "contacto": "info@teatroabasto.com", "recomendaciones": ["Apto para niños", "Duración: 1 hora"]}',
    'https://ejemplo.com/show-magia.jpg'
),
(
    'Taller de Danza Contemporánea',
    'Explora tu creatividad a través del movimiento',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Danza Contemporánea' LIMIT 1),
    '2024-05-05',
    '18:00',
    '{"nombre": "Estudio de Danza Contemporánea", "direccion": "Av. Córdoba 1234, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 3500, "moneda": "ARS"}',
    '{"capacidad": 18, "contacto": "info@danzacontemporanea.com", "recomendaciones": ["Ropa cómoda", "No experiencia necesaria"]}',
    'https://ejemplo.com/taller-danza.jpg'
),
(
    'Concierto de Música Electrónica',
    'Los mejores DJs nacionales e internacionales',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Electrónica' LIMIT 1),
    '2024-05-10',
    '23:00',
    '{"nombre": "Club Niceto", "direccion": "Niceto Vega 5510, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 6000, "moneda": "ARS"}',
    '{"capacidad": 800, "contacto": "info@niceto.com", "recomendaciones": ["Mayores de 18 años", "Vestimenta casual"]}',
    'https://ejemplo.com/electronica-concert.jpg'
),
(
    'Charla sobre Historia Argentina',
    'Conferencia sobre la independencia argentina',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Historia' LIMIT 1),
    '2024-05-15',
    '19:00',
    '{"nombre": "Museo Histórico Nacional", "direccion": "Defensa 1600, CABA", "coordenadas": {"lat": -34.6208, "lng": -58.3731}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 150, "contacto": "info@museohistorico.gov.ar", "recomendaciones": ["Entrada libre", "Duración: 1.5 horas"]}',
    'https://ejemplo.com/charla-historia.jpg'
),
(
    'Taller de Flamenco',
    'Aprende los pasos básicos del flamenco',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Flamenco' LIMIT 1),
    '2024-05-20',
    '19:00',
    '{"nombre": "Academia de Flamenco", "direccion": "Av. Santa Fe 2345, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 3000, "moneda": "ARS"}',
    '{"capacidad": 12, "contacto": "info@flamencoacademy.com", "recomendaciones": ["Traer zapatos de flamenco", "Vestimenta cómoda"]}',
    'https://ejemplo.com/taller-flamenco.jpg'
),
(
    'Show de Hip Hop',
    'Competencia de freestyle y shows de rap',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Hip Hop' LIMIT 1),
    '2024-05-25',
    '20:30',
    '{"nombre": "Club Cultural Matienzo", "direccion": "Pringles 1249, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 2500, "moneda": "ARS"}',
    '{"capacidad": 200, "contacto": "info@matienzo.com", "recomendaciones": ["Mayores de 16 años", "Entrada anticipada"]}',
    'https://ejemplo.com/hip-hop-show.jpg'
),
(
    'Taller de Cuentacuentos',
    'Aprende técnicas de narración oral',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Cuentacuentos' LIMIT 1),
    '2024-06-01',
    '17:00',
    '{"nombre": "Biblioteca Nacional", "direccion": "Agüero 2502, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 2000, "moneda": "ARS"}',
    '{"capacidad": 25, "contacto": "talleres@bn.gov.ar", "recomendaciones": ["Dirigido a adultos", "Material incluido"]}',
    'https://ejemplo.com/taller-cuentos.jpg'
),
(
    'Concierto de Música Folklórica',
    'Los mejores intérpretes del folklore argentino',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Folk' LIMIT 1),
    '2024-06-05',
    '21:00',
    '{"nombre": "Peña Folklórica", "direccion": "Av. Corrientes 1234, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 4500, "moneda": "ARS"}',
    '{"capacidad": 300, "contacto": "info@penafolklorica.com", "recomendaciones": ["Traer instrumentos", "Cena incluida"]}',
    'https://ejemplo.com/folk-concert.jpg'
),
(
    'Charla sobre Medio Ambiente',
    'Conferencia sobre cambio climático y sostenibilidad',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Medio Ambiente' LIMIT 1),
    '2024-06-10',
    '18:30',
    '{"nombre": "Centro Cultural Recoleta", "direccion": "Junín 1930, CABA", "coordenadas": {"lat": -34.5875, "lng": -58.3931}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 200, "contacto": "info@centroculturalrecoleta.org", "recomendaciones": ["Entrada libre", "Certificado de asistencia"]}',
    'https://ejemplo.com/charla-medioambiente.jpg'
),
(
    'Taller de Ballet para Principiantes',
    'Introducción al ballet clásico',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Ballet' LIMIT 1),
    '2024-06-15',
    '18:00',
    '{"nombre": "Escuela de Ballet Clásico", "direccion": "Av. Santa Fe 3456, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 4000, "moneda": "ARS"}',
    '{"capacidad": 15, "contacto": "info@balletclasico.com", "recomendaciones": ["Traer zapatos de ballet", "Ropa adecuada"]}',
    'https://ejemplo.com/taller-ballet.jpg'
),
(
    'Show de Breakdance',
    'Competencia nacional de breakdance',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Breakdance' LIMIT 1),
    '2024-06-20',
    '19:00',
    '{"nombre": "Plaza de la República", "direccion": "Av. Corrientes 1234, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 1000, "contacto": "info@breakdanceba.com", "recomendaciones": ["Al aire libre", "Traer agua"]}',
    'https://ejemplo.com/breakdance-show.jpg'
),
(
    'Concierto de Reggae',
    'Los mejores artistas de reggae jamaicano',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Reggae' LIMIT 1),
    '2024-06-25',
    '20:00',
    '{"nombre": "Club Niceto", "direccion": "Niceto Vega 5510, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": false, "monto": 5000, "moneda": "ARS"}',
    '{"capacidad": 600, "contacto": "info@niceto.com", "recomendaciones": ["Vestimenta casual", "Mayores de 18 años"]}',
    'https://ejemplo.com/reggae-concert.jpg'
),
(
    'Taller de Arquitectura',
    'Introducción al diseño arquitectónico',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Arquitectura' LIMIT 1),
    '2024-07-01',
    '18:30',
    '{"nombre": "Facultad de Arquitectura UBA", "direccion": "Av. Intendente Güiraldes 2160, CABA", "coordenadas": {"lat": -34.5408, "lng": -58.4431}}',
    '{"esGratuito": false, "monto": 3000, "moneda": "ARS"}',
    '{"capacidad": 30, "contacto": "talleres@fadu.uba.ar", "recomendaciones": ["Traer materiales", "Dirigido a estudiantes"]}',
    'https://ejemplo.com/taller-arquitectura.jpg'
),
(
    'Charla sobre Psicología',
    'Conferencia sobre salud mental y bienestar',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Psicología' LIMIT 1),
    '2024-07-05',
    '19:00',
    '{"nombre": "Centro de Psicología", "direccion": "Av. Corrientes 1234, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 100, "contacto": "info@centropsicologia.com", "recomendaciones": ["Entrada libre", "Certificado de asistencia"]}',
    'https://ejemplo.com/charla-psicologia.jpg'
),
(
    'Show de Circo',
    'Espectáculo circense con acróbatas y malabaristas',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Circo' LIMIT 1),
    '2024-07-10',
    '20:00',
    '{"nombre": "Circo del Sol", "direccion": "Av. del Libertador 1234, CABA", "coordenadas": {"lat": -34.5731, "lng": -58.4011}}',
    '{"esGratuito": false, "monto": 8000, "moneda": "ARS"}',
    '{"capacidad": 2000, "contacto": "info@circodelsol.com", "recomendaciones": ["Apto para toda la familia", "Duración: 2 horas"]}',
    'https://ejemplo.com/show-circo.jpg'
),
(
    'Taller de Tango',
    'Aprende los pasos básicos del tango',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Tango' LIMIT 1),
    '2024-07-15',
    '19:30',
    '{"nombre": "Academia de Tango", "direccion": "Av. Corrientes 1234, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 2500, "moneda": "ARS"}',
    '{"capacidad": 20, "contacto": "info@tangoschool.com", "recomendaciones": ["Venir con pareja", "Zapatos cómodos"]}',
    'https://ejemplo.com/taller-tango.jpg'
),
(
    'Concierto de Música Pop',
    'Los artistas más populares del momento',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Pop' LIMIT 1),
    '2024-07-20',
    '21:00',
    '{"nombre": "Estadio Luna Park", "direccion": "Av. Corrientes 4200, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 12000, "moneda": "ARS"}',
    '{"capacidad": 8000, "contacto": "info@lunapark.com.ar", "recomendaciones": ["Llegar temprano", "No cámaras profesionales"]}',
    'https://ejemplo.com/pop-concert.jpg'
),
(
    'Charla sobre Ciencia',
    'Conferencia sobre avances científicos',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Ciencia' LIMIT 1),
    '2024-07-25',
    '18:00',
    '{"nombre": "Museo de Ciencias Naturales", "direccion": "Av. Ángel Gallardo 470, CABA", "coordenadas": {"lat": -34.5889, "lng": -58.4019}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 150, "contacto": "info@museociencias.gov.ar", "recomendaciones": ["Entrada libre", "Dirigido a público general"]}',
    'https://ejemplo.com/charla-ciencia.jpg'
),
(
    'Taller de Filosofía',
    'Introducción a la filosofía occidental',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Filosofía' LIMIT 1),
    '2024-08-01',
    '19:00',
    '{"nombre": "Centro Cultural Borges", "direccion": "Viamonte 525, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": false, "monto": 2000, "moneda": "ARS"}',
    '{"capacidad": 25, "contacto": "info@centroborges.com", "recomendaciones": ["Traer cuaderno", "Lecturas previas"]}',
    'https://ejemplo.com/taller-filosofia.jpg'
),
(
    'Debate Público',
    'Debate sobre temas de actualidad',
    'evento_cultural',
    (SELECT id FROM api_categorias WHERE nombre = 'Debate' LIMIT 1),
    '2024-08-05',
    '20:00',
    '{"nombre": "Centro Cultural San Martín", "direccion": "Sarmiento 1551, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 200, "contacto": "info@ccgsm.gov.ar", "recomendaciones": ["Entrada libre", "Participación del público"]}',
    'https://ejemplo.com/debate-publico.jpg'
),
(
    'Concierto de Música Clásica',
    'Orquesta Filarmónica de Buenos Aires',
    'recital',
    (SELECT id FROM api_categorias WHERE nombre = 'Música Clásica' LIMIT 1),
    '2024-08-10',
    '20:30',
    '{"nombre": "Teatro Colón", "direccion": "Cerrito 628, CABA", "coordenadas": {"lat": -34.6012, "lng": -58.3836}}',
    '{"esGratuito": false, "monto": 15000, "moneda": "ARS"}',
    '{"capacidad": 2500, "contacto": "info@teatrocolon.org.ar", "recomendaciones": ["Vestimenta formal", "Llegar 30 min antes"]}',
    'https://ejemplo.com/concierto-clasico-2.jpg'
),
(
    'Taller de Medicina',
    'Introducción a la medicina preventiva',
    'taller',
    (SELECT id FROM api_categorias WHERE nombre = 'Medicina' LIMIT 1),
    '2024-08-15',
    '18:30',
    '{"nombre": "Hospital de Clínicas", "direccion": "Av. Córdoba 2351, CABA", "coordenadas": {"lat": -34.6037, "lng": -58.3816}}',
    '{"esGratuito": true, "monto": 0, "moneda": "ARS"}',
    '{"capacidad": 50, "contacto": "info@hospitalclinicas.gov.ar", "recomendaciones": ["Dirigido a estudiantes", "Certificado de asistencia"]}',
    'https://ejemplo.com/taller-medicina.jpg'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DE LA QUERY COMPLETA
-- =====================================================

-- Para verificar que todo se insertó correctamente:
-- SELECT COUNT(*) as total_categorias FROM api_categorias;
-- SELECT COUNT(*) as total_usuarios FROM api_usuarios;
-- SELECT COUNT(*) as total_eventos FROM api_eventos;
