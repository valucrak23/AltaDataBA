// Queries MongoDB nativas para insertar 15 eventos y 3 categorías
// Ejecutar en MongoDB Shell, MongoDB Compass, o después de obtener los ObjectIds de las categorías

// ==========================================
// PASO 1: INSERTAR 3 CATEGORÍAS
// ==========================================

db.categorias.insertMany([
    {
        nombre: 'Arte y Cultura',
        descripcion: 'Eventos de arte, exposiciones, museos y expresiones culturales diversas',
        icono: '🎨',
        color: '#6f42c1',
        activa: true,
        fechaCreacion: new Date()
    },
    {
        nombre: 'Tecnología e Innovación',
        descripcion: 'Talleres, charlas y eventos relacionados con tecnología, programación e innovación',
        icono: '💻',
        color: '#17a2b8',
        activa: true,
        fechaCreacion: new Date()
    },
    {
        nombre: 'Gastronomía y Vinos',
        descripcion: 'Degustaciones, ferias gastronómicas, talleres de cocina y eventos vinícolas',
        icono: '🍷',
        color: '#dc3545',
        activa: true,
        fechaCreacion: new Date()
    }
]);

// NOTA: Guarda los IDs de las categorías insertadas para usarlos en los eventos
// Ejemplo:
// var categoriaArteId = ObjectId("..."); // ID de "Arte y Cultura"
// var categoriaTecnoId = ObjectId("..."); // ID de "Tecnología e Innovación"
// var categoriaGastroId = ObjectId("..."); // ID de "Gastronomía y Vinos"

// O busca los IDs así:
// var categoriaArte = db.categorias.findOne({nombre: "Arte y Cultura"});
// var categoriaTecno = db.categorias.findOne({nombre: "Tecnología e Innovación"});
// var categoriaGastro = db.categorias.findOne({nombre: "Gastronomía y Vinos"});

// ==========================================
// PASO 2: OBTENER IDs DE CATEGORÍAS
// ==========================================

var categoriaArte = db.categorias.findOne({nombre: "Arte y Cultura"});
var categoriaTecno = db.categorias.findOne({nombre: "Tecnología e Innovación"});
var categoriaGastro = db.categorias.findOne({nombre: "Gastronomía y Vinos"});

// ==========================================
// PASO 3: INSERTAR 15 EVENTOS
// ==========================================

// Calcular fechas (próximos 3 meses desde hoy)
var hoy = new Date();
var proximaSemana = new Date(hoy);
proximaSemana.setDate(hoy.getDate() + 7);

db.eventos.insertMany([
    // RECITALES
    {
        titulo: 'Festival de Rock Nacional',
        descripcion: 'Noche inolvidable con las mejores bandas del rock argentino. Una experiencia única que reúne a artistas consagrados y nuevas promesas de la escena musical local.',
        tipo: 'recital',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana),
        hora: '20:00',
        ubicacion: {
            nombre: 'Estadio Luna Park',
            direccion: 'Av. Corrientes 4200, CABA',
            coordenadas: {
                lat: -34.6037,
                lng: -58.3816
            }
        },
        precio: {
            esGratuito: false,
            monto: 8000,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Subte línea B, estación Carlos Gardel. Colectivos: 6, 26, 140, 151',
            recomendaciones: ['Llegar con anticipación', 'No traer mochilas grandes', 'Documento de identidad obligatorio'],
            contacto: 'ventas@lunapark.com.ar',
            capacidad: 8000
        },
        color: '#ff6b6b',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Noche de Tango en San Telmo',
        descripcion: 'Espectáculo de tango tradicional con orquesta en vivo y bailarines profesionales. Incluye cena opcional y ambiente íntimo.',
        tipo: 'recital',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 2 * 24 * 60 * 60 * 1000),
        hora: '21:30',
        ubicacion: {
            nombre: 'Casa de Tango',
            direccion: 'Defensa 833, San Telmo, CABA',
            coordenadas: {
                lat: -34.6200,
                lng: -58.3730
            }
        },
        precio: {
            esGratuito: false,
            monto: 3500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 22, 24, 29, 126. Caminando desde Plaza Dorrego',
            recomendaciones: ['Vestimenta elegante casual', 'Reserva anticipada recomendada'],
            contacto: 'info@casatango.com',
            capacidad: 150
        },
        color: '#ff6b6b',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Concierto Acústico - Música Indie',
        descripcion: 'Show íntimo con artistas independientes. Acústico con formato reducido para una experiencia cercana con los músicos.',
        tipo: 'recital',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 5 * 24 * 60 * 60 * 1000),
        hora: '19:00',
        ubicacion: {
            nombre: 'Niceto Club',
            direccion: 'Av. Niceto Vega 5510, Palermo, CABA',
            coordenadas: {
                lat: -34.5890,
                lng: -58.4240
            }
        },
        precio: {
            esGratuito: false,
            monto: 4500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 55, 111, 140. Subte línea D, estación Plaza Italia',
            recomendaciones: ['Llegar temprano para conseguir buen lugar', 'Estacionamiento limitado'],
            contacto: 'info@nicetoclub.com',
            capacidad: 500
        },
        color: '#ff6b6b',
        activo: true,
        fechaCreacion: new Date()
    },
    
    // EVENTOS CULTURALES
    {
        titulo: 'Exposición de Arte Contemporáneo',
        descripcion: 'Muestra colectiva de artistas emergentes de Buenos Aires. Incluye pintura, escultura, fotografía e instalaciones interactivas.',
        tipo: 'evento_cultural',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 3 * 24 * 60 * 60 * 1000),
        hora: '18:00',
        ubicacion: {
            nombre: 'MALBA - Museo de Arte Latinoamericano',
            direccion: 'Av. Figueroa Alcorta 3415, CABA',
            coordenadas: {
                lat: -34.5805,
                lng: -58.4017
            }
        },
        precio: {
            esGratuito: false,
            monto: 2500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 10, 37, 59, 60, 110, 152. Subte línea D, estación Bulnes',
            recomendaciones: ['Entradas con descuento para estudiantes', 'Visita guiada a las 19:00'],
            contacto: 'info@malba.org.ar',
            capacidad: 200
        },
        color: '#4ecdc4',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Festival de Cine Independiente',
        descripcion: 'Proyección de cortometrajes y largometrajes independientes argentinos. Incluye charla con directores y networking.',
        tipo: 'evento_cultural',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 7 * 24 * 60 * 60 * 1000),
        hora: '19:30',
        ubicacion: {
            nombre: 'Cine Gaumont',
            direccion: 'Av. Rivadavia 1635, CABA',
            coordenadas: {
                lat: -34.6095,
                lng: -58.3895
            }
        },
        precio: {
            esGratuito: true,
            monto: 0,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Subte línea A, estación Congreso. Colectivos: 7, 24, 86',
            recomendaciones: ['Llegar 30 minutos antes', 'Cupo limitado'],
            contacto: 'festival@cinegaumont.com',
            capacidad: 300
        },
        color: '#4ecdc4',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Noche de Museos Abiertos',
        descripcion: 'Recorrido nocturno por los principales museos del barrio de Recoleta. Transporte incluido entre sedes.',
        tipo: 'evento_cultural',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 10 * 24 * 60 * 60 * 1000),
        hora: '20:00',
        ubicacion: {
            nombre: 'Museo Nacional de Bellas Artes',
            direccion: 'Av. del Libertador 1473, CABA',
            coordenadas: {
                lat: -34.5881,
                lng: -58.3947
            }
        },
        precio: {
            esGratuito: true,
            monto: 0,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 10, 37, 59, 60, 92, 102',
            recomendaciones: ['Zapatos cómodos recomendados', 'Cupos limitados, reserva anticipada'],
            contacto: 'museos@cultura.gob.ar',
            capacidad: 400
        },
        color: '#4ecdc4',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Feria de Artesanos en Plaza Serrano',
        descripcion: 'Feria de diseño independiente con productos artesanales, arte local y gastronomía. Música en vivo y ambiente familiar.',
        tipo: 'evento_cultural',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 14 * 24 * 60 * 60 * 1000),
        hora: '11:00',
        ubicacion: {
            nombre: 'Plaza Serrano',
            direccion: 'Plaza Cortázar, Palermo, CABA',
            coordenadas: {
                lat: -34.5890,
                lng: -58.4310
            }
        },
        precio: {
            esGratuito: true,
            monto: 0,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 55, 140, 168. Subte línea D, estación Scalabrini Ortiz',
            recomendaciones: ['Traer efectivo', 'Perros bienvenidos', 'Dura hasta las 20:00'],
            contacto: 'feria@artesanospalermo.com',
            capacidad: 1000
        },
        color: '#4ecdc4',
        activo: true,
        fechaCreacion: new Date()
    },
    
    // TALLERES
    {
        titulo: 'Taller de Programación Web Full Stack',
        descripcion: 'Aprende a crear aplicaciones web completas con HTML, CSS, JavaScript, Node.js y bases de datos. Desde cero hasta proyecto final.',
        tipo: 'taller',
        categoria: categoriaTecno._id,
        fecha: new Date(proximaSemana.getTime() + 4 * 24 * 60 * 60 * 1000),
        hora: '10:00',
        ubicacion: {
            nombre: 'Centro de Capacitación Digital',
            direccion: 'Av. Santa Fe 1850, CABA',
            coordenadas: {
                lat: -34.5910,
                lng: -58.4020
            }
        },
        precio: {
            esGratuito: false,
            monto: 12000,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Subte línea D, estación Santa Fe. Colectivos: 10, 37, 110',
            recomendaciones: ['Traer notebook', 'Cupos limitados a 20 personas', 'Material incluido'],
            contacto: 'info@centrodigital.com',
            capacidad: 20
        },
        color: '#ffe66d',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Taller de Inteligencia Artificial para Principiantes',
        descripcion: 'Introducción práctica a la IA y machine learning. Proyectos hands-on con Python y herramientas modernas.',
        tipo: 'taller',
        categoria: categoriaTecno._id,
        fecha: new Date(proximaSemana.getTime() + 8 * 24 * 60 * 60 * 1000),
        hora: '14:00',
        ubicacion: {
            nombre: 'Laboratorio de Innovación',
            direccion: 'Av. Córdoba 1350, CABA',
            coordenadas: {
                lat: -34.6030,
                lng: -58.3890
            }
        },
        precio: {
            esGratuito: false,
            monto: 8500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Subte línea B, estación Callao. Colectivos: 12, 24, 29, 60',
            recomendaciones: ['Conocimientos básicos de Python recomendados', 'Notebook con Python instalado'],
            contacto: 'ia@innovacionlab.com',
            capacidad: 25
        },
        color: '#ffe66d',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Workshop de UX/UI Design',
        descripcion: 'Aprende diseño de interfaces y experiencia de usuario. Desde conceptos hasta prototipado con Figma.',
        tipo: 'taller',
        categoria: categoriaTecno._id,
        fecha: new Date(proximaSemana.getTime() + 11 * 24 * 60 * 60 * 1000),
        hora: '18:00',
        ubicacion: {
            nombre: 'Design Hub',
            direccion: 'Honduras 4773, Palermo, CABA',
            coordenadas: {
                lat: -34.5900,
                lng: -58.4260
            }
        },
        precio: {
            esGratuito: false,
            monto: 6500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 55, 140, 168',
            recomendaciones: ['Acceso gratuito a Figma', 'Laptop recomendada pero no obligatoria'],
            contacto: 'design@designhub.com',
            capacidad: 30
        },
        color: '#ffe66d',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Taller de Cocina Italiana',
        descripcion: 'Aprende a preparar pasta casera, risotto y tiramisú con chef italiano. Incluye degustación de vinos y materiales.',
        tipo: 'taller',
        categoria: categoriaGastro._id,
        fecha: new Date(proximaSemana.getTime() + 6 * 24 * 60 * 60 * 1000),
        hora: '19:00',
        ubicacion: {
            nombre: 'Escuela de Cocina Italiana',
            direccion: 'Av. Cabildo 2300, Belgrano, CABA',
            coordenadas: {
                lat: -34.5640,
                lng: -58.4620
            }
        },
        precio: {
            esGratuito: false,
            monto: 9500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Subte línea D, estación Juramento. Colectivos: 29, 41, 42',
            recomendaciones: ['Delantal incluido', 'Llevar recipientes para llevar', 'Menores con acompañante'],
            contacto: 'cocina@escuelaitaliana.com',
            capacidad: 15
        },
        color: '#ffe66d',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Degustación de Vinos Argentinos',
        descripcion: 'Catas guiadas de vinos de las principales regiones argentinas. Incluye maridaje con quesos y embutidos.',
        tipo: 'evento_cultural',
        categoria: categoriaGastro._id,
        fecha: new Date(proximaSemana.getTime() + 9 * 24 * 60 * 60 * 1000),
        hora: '20:30',
        ubicacion: {
            nombre: 'Bodega Urbana',
            direccion: 'Gorriti 4761, Palermo, CABA',
            coordenadas: {
                lat: -34.5880,
                lng: -58.4280
            }
        },
        precio: {
            esGratuito: false,
            monto: 6000,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 55, 140, 168',
            recomendaciones: ['Mayores de 18 años', 'No conducir después del evento', 'Reserva anticipada requerida'],
            contacto: 'degustacion@bodegaurbana.com',
            capacidad: 40
        },
        color: '#4ecdc4',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Feria Gastronómica en Puerto Madero',
        descripcion: 'Food trucks, puestos gourmet y cervecería artesanal. Música en vivo y juegos para toda la familia.',
        tipo: 'evento_cultural',
        categoria: categoriaGastro._id,
        fecha: new Date(proximaSemana.getTime() + 12 * 24 * 60 * 60 * 1000),
        hora: '12:00',
        ubicacion: {
            nombre: 'Puerto Madero',
            direccion: 'Av. Alicia Moreau de Justo, CABA',
            coordenadas: {
                lat: -34.6100,
                lng: -58.3640
            }
        },
        precio: {
            esGratuito: true,
            monto: 0,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 4, 20, 33, 54, 64, 152',
            recomendaciones: ['Ambiente familiar', 'Estacionamiento disponible', 'Dura hasta las 22:00'],
            contacto: 'feria@puertomadero.com',
            capacidad: 2000
        },
        color: '#4ecdc4',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Taller de Cerámica para Principiantes',
        descripcion: 'Aprende técnicas básicas de modelado en arcilla. Incluye horneado de piezas y puedes llevarte tus creaciones.',
        tipo: 'taller',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 13 * 24 * 60 * 60 * 1000),
        hora: '16:00',
        ubicacion: {
            nombre: 'Taller de Arte La Boca',
            direccion: 'Av. Pedro de Mendoza 1835, La Boca, CABA',
            coordenadas: {
                lat: -34.6340,
                lng: -58.3630
            }
        },
        precio: {
            esGratuito: false,
            monto: 5500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 20, 25, 29, 86, 152',
            recomendaciones: ['Ropa que pueda mancharse', 'Todos los materiales incluidos', 'Edad mínima: 12 años'],
            contacto: 'ceramica@tallerarte.com',
            capacidad: 12
        },
        color: '#ffe66d',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Festival de Música Electrónica',
        descripcion: 'DJs internacionales y locales. Visuales 360°, mapping y tecnología de última generación.',
        tipo: 'recital',
        categoria: categoriaArte._id,
        fecha: new Date(proximaSemana.getTime() + 15 * 24 * 60 * 60 * 1000),
        hora: '23:00',
        ubicacion: {
            nombre: 'Club Atlético River Plate',
            direccion: 'Av. Presidente Figueroa Alcorta 7597, CABA',
            coordenadas: {
                lat: -34.5450,
                lng: -58.4490
            }
        },
        precio: {
            esGratuito: false,
            monto: 12000,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Colectivos: 28, 29, 42, 71, 111',
            recomendaciones: ['Mayores de 18 años', 'Llegar temprano', 'Venta anticipada con descuento'],
            contacto: 'electronic@riverplate.com',
            capacidad: 15000
        },
        color: '#ff6b6b',
        activo: true,
        fechaCreacion: new Date()
    },
    {
        titulo: 'Curso de Fotografía Digital',
        descripcion: 'Técnicas de composición, iluminación y edición. Salida práctica incluida por el barrio.',
        tipo: 'taller',
        categoria: categoriaTecno._id,
        fecha: new Date(proximaSemana.getTime() + 16 * 24 * 60 * 60 * 1000),
        hora: '15:00',
        ubicacion: {
            nombre: 'Academia de Fotografía',
            direccion: 'Av. Corrientes 1975, CABA',
            coordenadas: {
                lat: -34.6040,
                lng: -58.3920
            }
        },
        precio: {
            esGratuito: false,
            monto: 7500,
            moneda: 'ARS'
        },
        informacionAdicional: {
            comoLlegar: 'Subte línea B, estación Carlos Pellegrini. Colectivos: 24, 29, 60, 102',
            recomendaciones: ['Traer cámara (o smartphone)', 'Laptop para edición (opcional)'],
            contacto: 'foto@academia.com',
            capacidad: 18
        },
        color: '#ffe66d',
        activo: true,
        fechaCreacion: new Date()
    }
]);

// ==========================================
// VERIFICACIÓN
// ==========================================

// Contar eventos insertados
print("\n✅ Eventos insertados: " + db.eventos.countDocuments({}));
print("✅ Categorías insertadas: " + db.categorias.countDocuments({}));

// Ver algunos eventos
print("\n📋 Primeros 5 eventos:");
db.eventos.find().limit(5).forEach(function(evento) {
    print("  - " + evento.titulo + " (" + evento.tipo + ")");
});

