export type DevProject = {
  key: string;
  name: string;
  image: string;
  country: string;
  year: number;
  tipo: string;
  stage: string;
  shortDescription: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    label: string;
  };
};

export const DEV_PROJECTS: DevProject[] = [
  {
    key: 'nf-azul-001',
    name: 'Proyecto Romeral',
    image: '/images/projects/romeral.jpg',
    country: 'Argentina',
    year: 2024,
    tipo: 'Forestry',
    stage: 'Piloto',
    shortDescription:
      'Proyecto forestal enfocado en captura de carbono mediante restauración de bosque nativo.',
    description: `El Proyecto Romeral tiene como objetivo la restauración ecológica
y la captura de carbono mediante la recuperación de bosque nativo degradado.

El proyecto contempla manejo forestal sostenible, monitoreo de carbono
y generación futura de créditos certificados.`,
    location: {
      lat: -40.585,
      lng: -71.091,
      label: 'Río Negro, Argentina',
    },
  },

  {
    key: 'nf-eff-002',
    name: 'ENTE Río Negro',
    image: '/images/projects/ente-rn.jpg',
    country: 'Argentina',
    year: 2024,
    tipo: 'Eficiencia energética',
    stage: 'Fase 1',
    shortDescription:
      'Proyecto de eficiencia energética y reducción de emisiones en infraestructura pública.',
    description: `Programa de eficiencia energética en edificios públicos
orientado a la reducción del consumo eléctrico y emisiones de GEI.

Incluye recambio tecnológico, auditorías energéticas
y medición de impacto ambiental.`,
    location: {
      lat: -40.731,
      lng: -71.002,
      label: 'Río Negro, Argentina',
    },
  },
];
