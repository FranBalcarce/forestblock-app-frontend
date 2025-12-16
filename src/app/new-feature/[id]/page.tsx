'use client';

import { devProjects } from '@/data/devProjects';
import { useParams, useRouter } from 'next/navigation';
import MapView from '@/components/ProjectInfo/MapView';

export default function DevProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const project = devProjects.find((p) => p.id === id);

  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm bg-black/5 px-4 py-2 rounded-full"
      >
        ← Volver
      </button>

      {/* Banner */}
      <div className="rounded-3xl overflow-hidden bg-white shadow">
        <div
          className="h-72 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${project.image})` }}
        >
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
            {project.country} · {project.year} · {project.category}
          </div>

          <div className="absolute top-4 right-4 bg-forestGreen text-white px-3 py-1 rounded-full text-sm font-medium">
            {project.stage}
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-semibold">{project.name}</h1>

          <p className="mt-4 text-black/70 whitespace-pre-line">{project.longDescription}</p>

          {/* Mapa */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Ubicación</h2>

            <div className="h-80 rounded-xl overflow-hidden border">
              <MapView
                projectLocations={[
                  {
                    coordinates: [project.location.lat, project.location.lng],
                    name: project.name,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { useRouter, useParams } from 'next/navigation';
// import { useMemo } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// type DevProject = {
//   key: string;
//   name: string;
//   image: string;
//   country: string;
//   year: number;
//   tipo: string;
//   description: string;
// };

// const DEV_PROJECTS: DevProject[] = [
//   {
//     key: 'nf-azul-001',
//     name: 'Captura Azul (Blue Carbon) – Piloto',
//     // 👇 Acá va la imagen del banner. Cambiala si tenés otra ruta.
//     image: '/images/projects/blue-carbon.jpg',
//     country: 'Argentina',
//     year: 2024,
//     tipo: 'Blue carbon',
//     description:
//       'Proyecto piloto de captura y almacenamiento de carbono azul en ecosistemas costeros. Enfocado en restauración de humedales y monitoreo científico de la captura de CO₂.',
//   },
//   {
//     key: 'nf-eff-002',
//     name: 'Eficiencia Energética PyME – Fase 1',
//     image: '/images/projects/eficiencia.jpg',
//     country: 'Argentina',
//     year: 2024,
//     tipo: 'Eficiencia energética',
//     description:
//       'Programa de eficiencia energética para PyMEs, que incluye auditorías, mejoras en iluminación, motores y sistemas de climatización, con foco en reducción de consumo eléctrico y emisiones.',
//   },
// ];

// export default function DevProjectDetailPage() {
//   const router = useRouter();
//   const params = useParams<{ id: string }>();
//   const projectId = params?.id ?? '';

//   const project = useMemo(() => DEV_PROJECTS.find((p) => p.key === projectId), [projectId]);

//   if (!project) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <p className="mb-4">Proyecto no encontrado.</p>
//         <Link href="/new-feature" className="text-forestGreen underline">
//           Volver a proyectos en desarrollo
//         </Link>
//       </div>
//     );
//   }

//   // 👉 URL del formulario de contacto global (la que me pasaste)
//   const contactUrl = 'https://www.forestblock.tech/contact/contacto';

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
//       {/* Botón volver arriba, fuera del banner */}
//       <button
//         type="button"
//         onClick={() => router.back()}
//         className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 text-sm text-black hover:bg-black/10 transition"
//       >
//         <span className="text-lg leading-none">←</span>
//         <span>Volver</span>
//       </button>

//       {/* HEADER con imagen */}
//       <div className="mb-8 rounded-3xl overflow-hidden relative">
//         <div className="relative h-64 md:h-80">
//           <Image
//             src={project.image}
//             alt={project.name}
//             fill
//             style={{ objectFit: 'cover' }}
//             priority
//           />
//         </div>

//         {/* Degradado oscuro para el texto */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

//         {/* Texto sobre la imagen */}
//         <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
//           <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur">
//             Proyectos en desarrollo
//           </span>
//           <h1 className="text-2xl md:text-4xl font-aeonik font-semibold text-white">
//             {project.name}
//           </h1>
//           <div className="flex flex-wrap gap-2 text-sm">
//             <span className="px-3 py-1 rounded-full bg-white/18 text-white">{project.country}</span>
//             <span className="px-3 py-1 rounded-full bg-white/18 text-white">{project.year}</span>
//             <span className="px-3 py-1 rounded-full bg-mintGreen text-forestGreen">
//               {project.tipo}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* CONTENIDO */}
//       <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] gap-8">
//         {/* Descripción */}
//         <section>
//           <h2 className="text-xl font-semibold mb-3">Descripción</h2>
//           <p className="leading-relaxed text-black/80 whitespace-pre-line">{project.description}</p>
//         </section>

//         {/* Card con CTA al formulario de contacto global */}
//         <aside className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col justify-between gap-4">
//           <div>
//             <h2 className="text-lg font-semibold mb-2">¿Te interesa este proyecto?</h2>
//             <p className="text-sm text-black/70 mb-4">
//               Completá el formulario de contacto para que el equipo de Forestblock pueda enviarte
//               más información sobre <span className="font-medium">{project.name}</span>.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => router.push(contactUrl)}
//             className="rounded-full px-4 py-2 bg-forestGreen text-white text-sm font-medium hover:bg-forestGreen/90 transition"
//           >
//             Ir al formulario de contacto
//           </button>

//           <button
//             type="button"
//             onClick={() => router.push('/new-feature')}
//             className="mt-2 text-sm text-forestGreen underline text-left"
//           >
//             Volver a proyectos en desarrollo
//           </button>
//         </aside>
//       </div>
//     </div>
//   );
// }
