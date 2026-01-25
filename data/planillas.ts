import { Planilla, Oferta } from '../types';

// Imágenes generadas con IA para las planillas (servidas desde public/)
export const PLANILLA_IMAGES = {
    habitTracker: '/images/habit-tracker.png',
    financialPlanner: '/images/financial-planner.png',
};

export const planillas: Planilla[] = [
    {
        id: 'tracker-habitos',
        title: 'Tracker de Hábitos',
        shortDescription: 'Controla y mejora tus hábitos diarios con estadísticas automáticas',
        description: `El Tracker de Hábitos más completo para transformar tu vida. 
    
Incluye seguimiento mensual con checkboxes, estadísticas automáticas de cumplimiento, 
identificación de tu mejor y peor hábito del mes, y barras de progreso visuales 
que te motivan a seguir mejorando cada día.`,
        price: 1, // Precio de prueba
        originalPrice: 15,
        image: PLANILLA_IMAGES.habitTracker,
        color: 'green',
        features: [
            'Seguimiento de hasta 15 hábitos',
            'Calendario mensual interactivo',
            'Estadísticas automáticas',
            'Mejor/Peor hábito del mes',
            'Barras de progreso visuales',
            '% de cumplimiento por hábito',
            'Diseño profesional y limpio',
            'Compatible con Excel y Google Sheets',
        ],
    },
    {
        id: 'planificador-financiero',
        title: 'Planificador Financiero',
        shortDescription: 'Organiza tus finanzas personales con gráficos y reportes automáticos',
        description: `Toma el control total de tu dinero con el Planificador Financiero más completo.
    
Registra ingresos y gastos por categoría, visualiza tu distribución de gastos con gráficos 
de torta, compara ingresos vs gastos mensuales, y obtén insights sobre tu ahorro y deuda 
en tiempo real.`,
        price: 1, // Precio de prueba
        originalPrice: 20,
        image: PLANILLA_IMAGES.financialPlanner,
        color: 'purple',
        features: [
            'Dashboard con métricas clave',
            'Registro de ingresos y gastos',
            'Categorías personalizables',
            'Gráfico de distribución de gastos',
            'Comparativa mensual de ingresos vs gastos',
            'Cálculo automático de ahorro',
            'Seguimiento de deudas',
            'Compatible con Excel y Google Sheets',
        ],
    },
];

export const ofertas: Oferta[] = [
    {
        id: 'pack-productividad',
        title: 'Pack Productividad Total',
        description: 'Obtén las 2 planillas premium a un precio especial. Controla tus hábitos Y tus finanzas para una vida más organizada.',
        planillas: ['tracker-habitos', 'planificador-financiero'],
        price: 1.50, // Precio de prueba
        originalPrice: 35, // Suma de ambas originales
        savings: 33, // Porcentaje de ahorro
        image: '', // Se genera dinámicamente
    },
];

// Función helper para obtener planilla por ID
export const getPlanillaById = (id: string): Planilla | undefined => {
    return planillas.find(p => p.id === id);
};

// Función helper para obtener oferta por ID
export const getOfertaById = (id: string): Oferta | undefined => {
    return ofertas.find(o => o.id === id);
};
