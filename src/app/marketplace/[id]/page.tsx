import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

export default function MarketplaceByIdPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-black/70">Cargando proyecto...</p>
        </div>
      }
    >
      <MarketplaceByIdClient id={params.id} />
    </Suspense>
  );
}

// import { Suspense } from 'react';
// import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

// export const dynamic = 'force-dynamic';

// export default function MarketplaceByIdPage() {
//   return (
//     <Suspense fallback={null}>
//       <MarketplaceByIdClient />
//     </Suspense>
//   );
// }
