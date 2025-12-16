export type DevProjectStage = 'Idea' | 'Piloto' | 'Fase 1' | 'Fase 2';

export interface DevProject {
  id: string;
  name: string;
  country: string;
  stage: DevProjectStage;
  category: string;
  year: string;
  image: string;
  description: string;
  longDescription: string;
  location: {
    lat: number;
    lng: number;
  };
}

export const devProjects: DevProject[] = [
  {
    id: 'romeral',
    name: 'Proyecto Romeral',
    country: 'Chile',
    stage: 'Piloto',
    category: 'Forestry',
    year: '2024',
    image: '/images/dev/romeral.jpg',
    description:
      'Proyecto forestal enfocado en captura de carbono mediante restauración de bosque nativo.',
    longDescription: `
El Proyecto Romeral busca restaurar ecosistemas forestales degradados mediante
prácticas de manejo sostenible, incrementando la captura de carbono y generando
beneficios ambientales y sociales en la región.

El proyecto se encuentra actualmente en etapa piloto, validando metodologías
y monitoreo satelital.
    `,
    location: {
      lat: -34.567,
      lng: -71.002,
    },
  },

  {
    id: 'ente-rio-negro',
    name: 'ENTE Río Negro',
    country: 'Argentina',
    stage: 'Fase 1',
    category: 'Renewable Energy',
    year: '2025',
    image: '/images/dev/ente-rio-negro.jpg',
    description:
      'Proyecto de eficiencia energética y reducción de emisiones en infraestructura pública.',
    longDescription: `
Iniciativa desarrollada junto al ENTE Río Negro para reducir emisiones de GEI
a través de mejoras en eficiencia energética, gestión de residuos y monitoreo
de consumos en edificios públicos.

Actualmente en Fase 1 con estudios técnicos y levantamiento de línea base.
    `,
    location: {
      lat: -40.813,
      lng: -62.996,
    },
  },
];
