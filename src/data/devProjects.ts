export type DevProjectStage = 'Piloto' | 'Fase 1';

export type DevProject = {
  key: string;
  name: string;
  image: string; // ruta en /public
  country: string;
  year: number;
  tipo: string;
  stage: DevProjectStage;

  // para la tarjeta/listado
  shortDescription: string;

  // para el detalle
  longDescription: string;

  // mapa
  location: {
    label: string; // texto tipo "Santiago del Estero, Argentina"
    coordinates: [number, number]; // [lat, lng]
  };
};

export const DEV_PROJECTS: DevProject[] = [
  {
    key: 'nf-romeral-001',
    name: 'Proyecto Romeral',
    image: '/images/new-feature/romeral.png', // ✅ poné la imagen acá
    country: 'Argentina',
    year: 2025,
    tipo: 'Forestry',
    stage: 'Piloto',
    shortDescription:
      'Proyecto forestal enfocado en captura de carbono mediante restauración de bosque nativo.',
    longDescription:
      `Proyecto Romeral es una iniciativa forestal orientada a la captura de carbono mediante acciones de restauración y manejo sostenible de ecosistemas de bosque nativo.\n\n` +
      `El proyecto busca generar impacto climático medible a través de actividades de conservación, monitoreo y gestión territorial, con enfoque en co-beneficios ambientales y sociales.\n\n` +
      `Actualmente se encuentra en etapa Piloto, priorizando validación técnica, levantamiento de línea base y definición del plan operativo.`,
    location: {
      label: 'Santiago del Estero, Argentina',
      // del doc: “Coordenadas aproximadas: -25.8°S, -64.2°W”
      coordinates: [-25.8, -64.2],
    },
  },
  {
    key: 'nf-ente-rionegro-002',
    name: 'ENTE Río Negro',
    image: '/images/new-feature/ente.jpg', // ✅ poné la imagen acá
    country: 'Argentina',
    year: 2025,
    tipo: 'Eficiencia energética',
    stage: 'Fase 1',
    shortDescription:
      'Proyecto de eficiencia energética y reducción de emisiones en infraestructura pública.',
    longDescription:
      `ENTE Río Negro es un proyecto de eficiencia energética orientado a reducir consumos y emisiones en infraestructura pública a través de mejoras técnicas y optimización operativa.\n\n` +
      `Incluye diagnóstico, priorización de medidas, implementación de mejoras (equipamiento, gestión energética, etc.) y monitoreo de resultados para demostrar reducción de emisiones.\n\n` +
      `Actualmente se encuentra en Fase 1, enfocada en definición del alcance, relevamiento inicial y planificación de la implementación.`,
    location: {
      label: 'Río Negro, Argentina',
      // del doc: “Coordenadas aproximadas: -41.5°S, -66.5°W”
      coordinates: [-41.5, -66.5],
    },
  },
];

export const getDevProjectById = (id: string) => DEV_PROJECTS.find((p) => p.key === id);
