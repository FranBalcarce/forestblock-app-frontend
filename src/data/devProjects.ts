export type DevProject = {
  key: string;
  name: string;

  // ✅ NUEVO: 2 imágenes
  cardImage: string; // cuadrada (para cards)
  bannerImage: string; // banner (para detalle)

  country: string;
  countryCode: string; // ISO2 ej: "AR"
  year: number;
  tipo: string;
  stage: string;

  shortDescription: string;
  description: string;

  highlights?: string[];
  activities?: string[];
  impacts?: string[];
  certifications?: string[];
  stakeholders?: string[];
  nextSteps?: string[];

  location: {
    lat: number;
    lng: number;
    label: string;
  };

  // 🟡 compat (por si algún lado viejo usa "image")
  image?: string;
};

export const DEV_PROJECTS: DevProject[] = [
  {
    key: 'nf-azul-001',
    name: 'Proyecto Romeral',

    // ✅ poné acá tus 2 imágenes finales
    cardImage: '/images/projects/romeral-card.jpg',
    bannerImage: '/images/projects/romeral-banner.jpg',

    country: 'Argentina',
    countryCode: 'AR',
    year: 2024,
    tipo: 'Forestry',
    stage: 'Piloto',

    shortDescription:
      'Proyecto forestal enfocado en captura de carbono mediante restauración de bosque nativo.',

    description: `El Proyecto Romeral tiene como objetivo la restauración ecológica
y la captura de carbono mediante la recuperación de bosque nativo degradado.

El proyecto contempla manejo forestal sostenible, monitoreo de carbono
y generación futura de créditos certificados.`,

    highlights: [
      'Restauración y conservación de bosque nativo',
      'Captura de carbono a largo plazo',
      'Co-beneficios sobre biodiversidad y servicios ecosistémicos',
      'Potencial de certificación y emisión futura de créditos',
    ],
    activities: [
      'Levantamiento de línea base (uso del suelo, cobertura, biodiversidad)',
      'Plan de restauración con especies nativas y manejo adaptativo',
      'Monitoreo y reporte de carbono (MRV) y seguimiento ambiental',
      'Estrategia de gobernanza y vinculación con actores locales',
    ],
    impacts: [
      'Aumento de captura/almacenamiento de CO₂',
      'Protección de suelo y regulación hídrica',
      'Mejora de hábitats y conservación de biodiversidad',
      'Impacto social indirecto por empleo/servicios locales (según alcance)',
    ],
    certifications: ['Estándares de carbono (en evaluación)', 'Co-beneficios (en evaluación)'],
    stakeholders: [
      'Propietarios/gestores del área',
      'Comunidades locales',
      'Equipo técnico Forestblock',
    ],
    nextSteps: [
      'Validación de alcance y cronograma del piloto',
      'Cierre de línea base + plan de monitoreo',
      'Definición de ruta de certificación y estrategia de financiamiento',
    ],

    location: {
      lat: -40.585,
      lng: -71.091,
      label: 'Río Negro, Argentina',
    },

    // compat
    image: '/images/projects/romeral-banner.jpg',
  },

  {
    key: 'nf-eff-002',
    name: 'ENTE Río Negro',

    // ✅ poné acá tus 2 imágenes finales
    cardImage: '/images/projects/ente-rn-card.jpg',
    bannerImage: '/images/projects/ente-rn-banner.jpg',

    country: 'Argentina',
    countryCode: 'AR',
    year: 2024,
    tipo: 'Eficiencia energética',
    stage: 'Fase 1',

    shortDescription:
      'Proyecto de eficiencia energética y reducción de emisiones en infraestructura pública.',

    description: `Programa de eficiencia energética en edificios públicos
orientado a la reducción del consumo eléctrico y emisiones de GEI.

Incluye recambio tecnológico, auditorías energéticas
y medición de impacto ambiental.`,

    highlights: [
      'Reducción de consumo eléctrico y emisiones asociadas',
      'Modernización tecnológica en infraestructura pública',
      'Medición y verificación de resultados',
      'Modelo escalable a más edificios/municipios',
    ],
    activities: [
      'Auditorías energéticas y diagnóstico de consumos',
      'Recambio de luminarias/equipos por tecnología eficiente',
      'Optimización de operación/mantenimiento',
      'Sistema de medición y seguimiento (kWh, CO₂e, ahorros)',
    ],
    impacts: [
      'Menor huella de carbono (Scope 2) por menor consumo eléctrico',
      'Ahorros económicos sostenidos en operación',
      'Mejora del desempeño y confiabilidad de instalaciones',
      'Mejores prácticas y concientización energética',
    ],
    certifications: [
      'Medición verificable de impacto (MRV)',
      'Buenas prácticas de EE (referencial)',
    ],
    stakeholders: ['ENTE / sector público', 'Usuarios de edificios', 'Equipo técnico Forestblock'],
    nextSteps: [
      'Priorización de edificios/medidas por ROI e impacto',
      'Implementación del recambio y puesta en marcha',
      'Tablero de resultados + reporte periódico',
    ],

    location: {
      lat: -40.731,
      lng: -71.002,
      label: 'Río Negro, Argentina',
    },

    // compat
    image: '/images/projects/ente-rn-banner.jpg',
  },
];
