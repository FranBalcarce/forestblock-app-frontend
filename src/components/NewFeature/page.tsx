'use client';

import React, { useMemo, useState } from 'react';
import HeaderSection from '@/components/Marketplace/HeaderSection';
import ProjectList from '@/components/Marketplace/ProjectList';
import Link from 'next/link';
import type { Project } from '@/types/project';

type ProjectMinimal = {
  key: string;
  name: string;
  images: string[];
  location: { geometry: { coordinates: [number, number] } };
};

/**
 * Adaptador: ProjectMinimal -> Project (placeholder para UI)
 * Rellena campos usados por ProjectCard/OverlayContent y castea vía unknown
 * para no exigir el resto de propiedades del tipo Project.
 */
function toFullProject(p: ProjectMinimal): Project {
  const partial = {
    key: p.key,
    name: p.name,
    images: p.images,
    location: p.location,

    // Campos usados por el Card
    price: 0,
    country: '—',
    vintages: [] as number[],
    methodologies: [{ category: '—' } as any],
    sustainableDevelopmentGoals: [] as any[],
  };

  return partial as unknown as Project;
}

export default function NewFeaturePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [loading] = useState<boolean>(false);

  const projectsMinimal: ProjectMinimal[] = useMemo(
    () => [
      {
        key: 'nf-azul-001',
        name: 'Captura Azul (Blue Carbon) – Piloto',
        images: ['/images/projects/blue-carbon.jpg'],
        location: { geometry: { coordinates: [-60.0, -36.5] } },
      },
      {
        key: 'nf-eff-002',
        name: 'Eficiencia Energética PyME – Fase 1',
        images: ['/images/projects/eficiencia.jpg'],
        location: { geometry: { coordinates: [-65.0, -43.1] } },
      },
    ],
    []
  );

  const filteredMinimal = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    return t ? projectsMinimal.filter((p) => p.name.toLowerCase().includes(t)) : projectsMinimal;
  }, [projectsMinimal, searchTerm]);

  const filtered: Project[] = useMemo(() => filteredMinimal.map(toFullProject), [filteredMinimal]);

  const actionRenderer = (p: Project) => (
    <Link
      href={`/new-feature/preorder/${p.key}`}
      className="inline-flex items-center rounded-xl px-4 py-2 border border-black/10 hover:bg-black/5 transition"
    >
      Completar formulario
    </Link>
  );

  return (
    <div className="flex flex-col gap-8">
      <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProjectList
        loading={loading}
        projects={filtered}
        sortBy={sortBy}
        setSortBy={setSortBy}
        openFilters={() => {}}
        actionRenderer={actionRenderer}
      />
    </div>
  );
}

// Este tiene el login
// 'use client';

// import React, { useMemo, useState } from 'react';
// import HeaderSection from '@/components/Marketplace/HeaderSection';
// import ProjectList from '@/components/Marketplace/ProjectList';
// import Link from 'next/link';

// type ProjectMinimal = {
//   key: string;
//   name: string;
//   images: string[];
//   location: { geometry: { coordinates: [number, number] } };
// };

// export default function NewFeaturePage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState<string>('relevance');
//   const [loading] = useState<boolean>(false);

//   const projects: ProjectMinimal[] = useMemo(
//     () => [
//       {
//         key: 'nf-azul-001',
//         name: 'Captura Azul (Blue Carbon) – Piloto',
//         images: ['/images/projects/blue-carbon.jpg'],
//         location: { geometry: { coordinates: [-60.0, -36.5] } },
//       },
//       {
//         key: 'nf-eff-002',
//         name: 'Eficiencia Energética PyME – Fase 1',
//         images: ['/images/projects/eficiencia.jpg'],
//         location: { geometry: { coordinates: [-65.0, -43.1] } },
//       },
//     ],
//     []
//   );

//   const filtered = useMemo(() => {
//     const t = searchTerm.trim().toLowerCase();
//     return t ? projects.filter((p) => p.name.toLowerCase().includes(t)) : projects;
//   }, [projects, searchTerm]);

//   const actionRenderer = (p: ProjectMinimal) => (
//     <Link
//       href={`/new-feature/preorder/${p.key}`}
//       className="inline-flex items-center rounded-xl px-4 py-2 border border-black/10 hover:bg-black/5 transition"
//     >
//       Completar formulario
//     </Link>
//   );

//   return (
//     <div className="flex flex-col gap-8">
//       <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//       <ProjectList
//         loading={loading}
//         projects={filtered as any}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//         openFilters={() => {}}
//         actionRenderer={actionRenderer as any}
//       />
//     </div>
//   );
// }
