// src/app/new-feature/como-funciona/page.tsx
import { Suspense } from 'react';
import ComoFuncionaClient from '@/components/new-feature/ComoFuncionaClient';

export const dynamic = 'force-dynamic';

export default function ComoFuncionaPage() {
  return (
    <Suspense fallback={null}>
      <ComoFuncionaClient />
    </Suspense>
  );
}

// 'use client';

// import HeroBanner from '@/components/HeroBanner/HeroBanner';
// import { useRouter } from 'next/navigation';

// export default function ComoFuncionaPage() {
//   const router = useRouter();

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
//       {/* Flecha de volver */}
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-forestGreen hover:text-forestGreen/70 mb-4 transition"
//       >
//         {/* Ícono SVG (no requiere librerías) */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="20"
//           height="20"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="lucide lucide-chevron-left"
//         >
//           <polyline points="15 18 9 12 15 6" />
//         </svg>
//         Volver
//       </button>

//       {/* Banner reutilizando HeroBanner */}
//       <HeroBanner
//         title={
//           <h1 className="text-[23px] md:text-[40px] font-bold font-aeonik leading-tight">
//             ¿Cómo funciona?
//           </h1>
//         }
//         showSearchbar={false}
//       >
//         <></>
//       </HeroBanner>

//       {/* Contenido */}
//       <section className="mt-10">
//         <h2 className="text-xl font-semibold mb-3">Descripción</h2>

//         <p className="leading-relaxed text-black/80 whitespace-pre-line">
//           Próximamente: información sobre cómo funcionan los proyectos en desarrollo.
//         </p>
//       </section>
//     </div>
//   );
// }
