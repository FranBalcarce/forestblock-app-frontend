'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types/project';
import Header from '@/components/new-feature/header';
import dynamic from 'next/dynamic';

// 👇 Cargar ProjectList solo en el cliente (por Leaflet)
const ProjectList = dynamic(() => import('@/components/Marketplace/ProjectList'), { ssr: false });

type ProjectMinimal = {
  key: string;
  name: string;
  images: string[];
  location: { geometry: { coordinates: [number, number] } };
  fase: 'Piloto' | 'Fase 1';
  tipo: 'Blue carbon' | 'Eficiencia energética';
};

function toFullProject(p: ProjectMinimal): Project {
  const partial = {
    key: p.key,
    name: p.name,
    images: p.images.map((url) => ({ url })),
    location: {
      type: 'Point',
      geometry: p.location.geometry,
    },
    price: '0',
    country: '—',
    vintages: [] as number[],
    methodologies: [{ category: p.tipo }],
    sustainableDevelopmentGoals: [],
  } as unknown as Project;

  return partial;
}

const NewFeatureClient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [loading] = useState<boolean>(false);

  const [faseFilter, setFaseFilter] = useState<'todas' | 'Piloto' | 'Fase 1'>('todas');
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'Blue carbon' | 'Eficiencia energética'>(
    'todos'
  );

  const projectsMinimal: ProjectMinimal[] = useMemo(
    () => [
      {
        key: 'nf-azul-001',
        name: 'Captura Azul (Blue Carbon) – Piloto',
        images: ['/images/projects/blue-carbon.jpg'],
        location: { geometry: { coordinates: [-60.0, -36.5] } },
        fase: 'Piloto',
        tipo: 'Blue carbon',
      },
      {
        key: 'nf-eff-002',
        name: 'Eficiencia Energética PyME – Fase 1',
        images: ['/images/projects/eficiencia.jpg'],
        location: { geometry: { coordinates: [-65.0, -43.1] } },
        fase: 'Fase 1',
        tipo: 'Eficiencia energética',
      },
    ],
    []
  );

  const filteredMinimal = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();

    return projectsMinimal.filter((p) => {
      const matchesSearch = !t || p.name.toLowerCase().includes(t);
      const matchesFase = faseFilter === 'todas' || p.fase === faseFilter;
      const matchesTipo = tipoFilter === 'todos' || p.tipo === tipoFilter;

      return matchesSearch && matchesFase && matchesTipo;
    });
  }, [projectsMinimal, searchTerm, faseFilter, tipoFilter]);

  const filtered: Project[] = useMemo(() => filteredMinimal.map(toFullProject), [filteredMinimal]);

  // ❌ Antes renderizaba un botón vacío dentro de cada card
  // ✔ Ahora no renderiza nada
  const actionRenderer = () => null;

  return (
    <div className="flex flex-col gap-8">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8 mt-4">
        <aside className="bg-white rounded-3xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Filtrar por:</h2>

          <div className="mb-4">
            <span className="block text-sm font-medium mb-2">Fase del proyecto</span>
            <div className="flex flex-col gap-2">
              {(['todas', 'Piloto', 'Fase 1'] as const).map((fase) => (
                <button
                  key={fase}
                  type="button"
                  onClick={() => setFaseFilter(fase)}
                  className={`text-sm text-left px-3 py-2 rounded-full border ${
                    faseFilter === fase
                      ? 'bg-mintGreen/20 border-mintGreen text-forestGreen'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {fase === 'todas' ? 'Todas las fases' : fase}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <span className="block text-sm font-medium mb-2">Tipo de proyecto</span>
            <div className="flex flex-col gap-2">
              {(['todos', 'Blue carbon', 'Eficiencia energética'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoFilter(tipo)}
                  className={`text-sm text-left px-3 py-2 rounded-full border ${
                    tipoFilter === tipo
                      ? 'bg-mintGreen/20 border-mintGreen text-forestGreen'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tipo === 'todos' ? 'Todos' : tipo}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <ProjectList
          loading={loading}
          projects={filtered}
          sortBy={sortBy}
          setSortBy={setSortBy}
          openFilters={() => {}}
          actionRenderer={actionRenderer} // 👈 ya sin botón
        />
      </div>
    </div>
  );
};

export default NewFeatureClient;

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
