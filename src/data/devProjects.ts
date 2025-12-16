// src/data/devProjects.ts

export type DevProject = {
  key: string;
  name: string;
  image: string;
  country: string;
  year: number;
  tipo: string;
  stage: 'Piloto' | 'Fase 1';
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
    key: 'nf-romeral',
    name: 'Proyecto El Romeral',
    image: '/images/dev/romeral.jpg', // poné la imagen acá
    country: 'Argentina',
    year: 2025,
    tipo: 'Forestry / REDD+',
    stage: 'Piloto',
    shortDescription:
      'Proyecto forestal enfocado en captura de carbono mediante restauración de bosque nativo.',
    description: `
Proyecto REDD+ / ARR / IFM ubicado en El Copo, Santiago del Estero.

El proyecto combina conservación, restauración y silvopastoreo integrado,
con un horizonte operativo de 40 años y un fuerte impacto en captura de CO₂.

VCUs estimados: ~880.000 en 10 años.
Precio estimado: USD 18–22 / VCU.
    `,
    location: {
      lat: -25.9,
      lng: -62.7,
      label: 'El Copo, Santiago del Estero',
    },
  },
  {
    key: 'nf-ente-rn',
    name: 'ENTE Río Negro – Ganadería Regenerativa',
    image: '/images/dev/ente-rn.jpg', // poné la imagen acá
    country: 'Argentina',
    year: 2026,
    tipo: 'Eficiencia energética / ALM',
    stage: 'Fase 1',
    shortDescription: 'Proyecto de ganadería regenerativa y manejo de suelos en la Patagonia.',
    description: `
Proyecto ALM (Improved Agricultural Land Management) en la Región Sur de Río Negro.

Busca regenerar pastizales naturales degradados y aumentar el stock de carbono
en suelos mediante prácticas ganaderas sostenibles.

Área inicial: 10.000 ha (piloto).
    `,
    location: {
      lat: -41.5,
      lng: -66.5,
      label: 'Región Sur, Río Negro',
    },
  },
];
