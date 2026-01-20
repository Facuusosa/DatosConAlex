import { Course } from '../types';

export const courses: Course[] = [
    {
        id: 'excel-zero-to-hero',
        title: 'Dominando Excel: De 0 a Profesional',
        description: 'Aprende Excel desde lo más básico hasta funciones avanzadas. Domina tablas dinámicas, macros y análisis de datos para destacar en tu trabajo.',
        shortDescription: 'Domina la herramienta más poderosa del mundo laboral con este curso completo.',
        price: 29,
        originalPrice: 89,
        image: 'https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&q=80&w=2000',
        instructor: 'Alex Data',
        duration: '12 horas',
        rating: 4.9,
        students: 2400,
        lastUpdated: 'Hace 2 días',
        level: 'Principiante',
        benefits: [
            'Acceso de por vida',
            'Soporte 24/7 de expertos',
            'Certificado oficial',
            'Plantillas descargables',
            'Ejercicios prácticos reales'
        ],
        features: [
            '12 Recursos descargables',
            'Acceso en móviles y TV',
            'Certificado de finalización'
        ]
    },
    {
        id: 'data-analytics-intro',
        title: 'Introducción al Análisis de Datos',
        description: 'Transforma datos en decisiones. Aprende a limpiar, procesar y visualizar datos como un analista profesional usando Excel y Power Query.',
        shortDescription: 'Conviértete en el analista que toda empresa busca.',
        price: 35,
        originalPrice: 99,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
        instructor: 'María Stats',
        duration: '15 horas',
        rating: 4.8,
        students: 1500,
        lastUpdated: 'Hace 1 semana',
        level: 'Intermedio',
        benefits: [
            'Proyectos de portafolio',
            'Mentoria grupal',
            'Certificado validado',
            'Datasets reales'
        ],
        features: [
            '20 Recursos descargables',
            'Casos de estudio reales',
            'Exámenes de práctica'
        ]
    },
    {
        id: 'vba-automation',
        title: 'Automatización con VBA y Macros',
        description: 'Deja de hacer tareas repetitivas. Aprende a programar macros en VBA para automatizar tus reportes diarios y ahorrar horas de trabajo.',
        shortDescription: 'Automatiza tu trabajo y ahorra horas cada día.',
        price: 45,
        originalPrice: 129,
        image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=2000',
        instructor: 'Carlos Code',
        duration: '18 horas',
        rating: 4.9,
        students: 800,
        lastUpdated: 'Hace 3 semanas',
        level: 'Avanzado',
        benefits: [
            'Librería de códigos lista para usar',
            'Soporte prioritario',
            'Certificado avanzado',
            'Proyectos complejos'
        ],
        features: [
            '30 Scripts listos para copiar',
            'Acceso a comunidad privada',
            'Actualizaciones gratuitas'
        ]
    },
    {
        id: 'dashboard-masterclass',
        title: 'Masterclass de Dashboards Impactantes',
        description: 'Diseña paneles de control que cuenten historias. Aprende principios de diseño y visualización de datos para crear dashboards que impresionen a tu jefe.',
        shortDescription: 'Crea reportes que todos quieran leer y entender.',
        price: 39,
        originalPrice: 109,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
        instructor: 'Alex Data',
        duration: '10 horas',
        rating: 4.7,
        students: 3100,
        lastUpdated: 'Hace 5 días',
        level: 'Intermedio',
        benefits: [
            'Plantillas de diseño PRO',
            'Guía de Storytelling',
            'Certificado de diseño',
            'Feedback de proyectos'
        ],
        features: [
            '5 Plantillas Premium',
            'Guía de colores y tipografía',
            'Acceso ilimitado'
        ]
    }
];
