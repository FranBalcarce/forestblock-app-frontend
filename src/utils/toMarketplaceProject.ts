import type { Project } from '@/types/project';
import { DEV_PROJECTS } from '@/data/devProjects';

export type ProjectWithCountryCode = Project & {
  countryCode?: string;
  country_code?: string;
  coverImage?: { url: string; caption: string };
  displayPrice?: string;
};

export function toMarketplaceProject(p: (typeof DEV_PROJECTS)[number]): ProjectWithCountryCode {
  const cardSrc = p.cardImage || p.image || '/images/categories/other.png';
  const bannerSrc = p.bannerImage || p.cardImage || p.image || '/images/categories/other.png';

  const project = {
    key: p.key,
    name: p.name,

    images: [{ url: cardSrc, caption: p.name }],
    coverImage: { url: bannerSrc, caption: p.name },

    country: p.country,

    // ✅ bandera: depende tu componente, dejamos las 2
    countryCode: p.countryCode,
    country_code: p.countryCode,

    price: '0',
    displayPrice: '0',

    vintages: [],

    methodologies: [
      {
        id: `dev-${p.key}`,
        name: p.tipo,
        category: p.tipo,
      },
    ],

    sustainableDevelopmentGoals: [],

    location: {
      type: 'Point',
      geometry: {
        type: 'Point',
        coordinates: [p.location.lng, p.location.lat], // GeoJSON [lng, lat]
      },
    },
  };

  return project as unknown as ProjectWithCountryCode;
}
