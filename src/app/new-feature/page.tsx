'use client';

import { devProjects } from '@/data/devProjects';
import { useRouter } from 'next/navigation';

export default function NewFeaturePage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Proyectos en Desarrollo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer overflow-hidden"
            onClick={() => router.push(`/new-feature/${p.id}`)}
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${p.image})` }}
            />

            <div className="p-4">
              <div className="text-xs uppercase text-forestGreen font-semibold mb-1">{p.stage}</div>

              <h2 className="text-xl font-medium">{p.name}</h2>

              <p className="text-sm text-black/60 mt-2">{p.description}</p>
            </div>
          </div>
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
