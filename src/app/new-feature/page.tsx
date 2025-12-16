'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DEV_PROJECTS } from '@/data/devProjects';

export default function NewFeaturePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return DEV_PROJECTS;
    return DEV_PROJECTS.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.tipo.toLowerCase().includes(s) ||
        p.stage.toLowerCase().includes(s)
    );
  }, [search]);

  return (
    <div className="p-3 flex flex-col min-h-screen">
      {/* HERO (similar al look que venías usando) */}
      <div className="relative rounded-3xl overflow-hidden">
        <div className="relative h-56 md:h-72">
          <Image
            src="/images/hero/forest.jpg"
            alt="Proyectos en desarrollo"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-6 md:px-10 w-full">
            <h1 className="text-3xl md:text-5xl font-aeonik font-semibold text-white leading-tight">
              Proyectos en Desarrollo:
              <br />
              <span className="text-mintGreen">Oportunidades de Inversión Temprana en Carbono</span>
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
                onClick={() => router.push('/como-funciona')}
              >
                ¿Cómo funciona?
              </button>

              <button
                type="button"
                className="rounded-full px-4 py-2 bg-transparent border border-white/70 text-white text-sm font-medium hover:bg-white/10 transition"
                onClick={() => router.push('https://www.forestblock.tech/contact/contacto')}
              >
                Contactar equipo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-full shadow px-4 py-3 flex items-center gap-3 border border-black/5">
            <span className="text-black/40">🔎</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proyecto..."
              className="w-full outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {filtered.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => router.push(`/new-feature/${p.key}`)}
            className="text-left rounded-3xl bg-white border border-black/5 shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="relative h-44 md:h-48 bg-black/5">
              <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur">
                    {p.stage.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 text-xl font-aeonik font-semibold text-white">{p.name}</div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                <span className="px-3 py-1 rounded-full bg-black/5 text-black/70">{p.country}</span>
                <span className="px-3 py-1 rounded-full bg-black/5 text-black/70">{p.year}</span>
                <span className="px-3 py-1 rounded-full bg-mintGreen text-forestGreen font-medium">
                  {p.tipo}
                </span>
              </div>

              <p className="text-sm text-black/70 leading-relaxed">{p.shortDescription}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// // src/app/new-feature/page.tsx
// import { Suspense } from 'react';
// import NewFeatureClient from '@/components/new-feature/NewFeatureClient';

// export const dynamic = 'force-dynamic';

// export default function NewFeaturePage() {
//   return (
//     <Suspense fallback={null}>
//       <NewFeatureClient />
//     </Suspense>
//   );
// }
