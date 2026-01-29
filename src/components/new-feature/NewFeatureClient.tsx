'use client';

import React, { useMemo, useState } from 'react';
import type { Project } from '@/types/project';
import type { SortBy } from '@/types/marketplace';

import Header from '@/components/new-feature/header';
import DevProjectCard from '@/components/new-feature/DevProjectCard';

import { DEV_PROJECTS } from '@/data/devProjects';
import { toMarketplaceProject } from '@/utils/toMarketplaceProject';

/* ------------------------------------------------ */

const NewFeatureClient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy] = useState<SortBy>('price_desc'); // solo para compatibilidad visual
  const [loading] = useState(false);

  // filtros
  const [faseFilter, setFaseFilter] = useState<'todas' | 'Piloto' | 'Fase 1'>('todas');
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'Forestry' | 'Eficiencia energética'>(
    'todos'
  );
  const [countryFilter, setCountryFilter] = useState<'todos' | string>('todos');
  const [yearFilter, setYearFilter] = useState<'todos' | number>('todos');

  // valores únicos
  const countries = useMemo(() => Array.from(new Set(DEV_PROJECTS.map((p) => p.country))), []);
  const years = useMemo(
    () => Array.from(new Set(DEV_PROJECTS.map((p) => p.year))).sort((a, b) => b - a),
    []
  );

  // filtrado
  const filteredDev = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();

    return DEV_PROJECTS.filter((p) => {
      const matchesSearch =
        !t ||
        p.name.toLowerCase().includes(t) ||
        p.tipo.toLowerCase().includes(t) ||
        p.stage.toLowerCase().includes(t);

      return (
        (faseFilter === 'todas' || p.stage === faseFilter) &&
        (tipoFilter === 'todos' || p.tipo === tipoFilter) &&
        (countryFilter === 'todos' || p.country === countryFilter) &&
        (yearFilter === 'todos' || p.year === yearFilter) &&
        matchesSearch
      );
    });
  }, [searchTerm, faseFilter, tipoFilter, countryFilter, yearFilter]);

  // adaptar a Project (sin precio)
  const projects: Project[] = useMemo(() => filteredDev.map(toMarketplaceProject), [filteredDev]);

  return (
    <div className="flex flex-col gap-8">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8 mt-4">
        {/* SIDEBAR */}
        <aside className="bg-white rounded-3xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Filtrar por:</h2>

          <FilterSection title="Fase del proyecto">
            {(['todas', 'Piloto', 'Fase 1'] as const).map((fase) => (
              <FilterButton
                key={fase}
                active={faseFilter === fase}
                onClick={() => setFaseFilter(fase)}
                label={fase === 'todas' ? 'Todas las fases' : fase}
              />
            ))}
          </FilterSection>

          <FilterSection title="Tipo de proyecto">
            {(['todos', 'Forestry', 'Eficiencia energética'] as const).map((tipo) => (
              <FilterButton
                key={tipo}
                active={tipoFilter === tipo}
                onClick={() => setTipoFilter(tipo)}
                label={tipo === 'todos' ? 'Todos' : tipo}
              />
            ))}
          </FilterSection>

          <FilterSection title="País">
            <FilterButton
              active={countryFilter === 'todos'}
              onClick={() => setCountryFilter('todos')}
              label="Todos"
            />
            {countries.map((c) => (
              <FilterButton
                key={c}
                active={countryFilter === c}
                onClick={() => setCountryFilter(c)}
                label={c}
              />
            ))}
          </FilterSection>

          <FilterSection title="Año">
            <FilterButton
              active={yearFilter === 'todos'}
              onClick={() => setYearFilter('todos')}
              label="Todos"
            />
            {years.map((y) => (
              <FilterButton
                key={y}
                active={yearFilter === y}
                onClick={() => setYearFilter(y)}
                label={String(y)}
              />
            ))}
          </FilterSection>
        </aside>

        {/* LISTADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p>Cargando…</p>}

          {!loading && !projects.length && (
            <p className="text-gray-500">No hay proyectos para mostrar</p>
          )}

          {projects.map((project) => (
            <DevProjectCard key={project.key} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewFeatureClient;

/* ----------------- helpers UI ----------------- */

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <span className="block text-sm font-medium mb-2">{title}</span>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

const FilterButton = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-sm text-left px-3 py-2 rounded-full border ${
      active
        ? 'bg-mintGreen/20 border-mintGreen text-forestGreen'
        : 'border-gray-200 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

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
