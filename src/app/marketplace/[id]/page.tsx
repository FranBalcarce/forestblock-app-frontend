import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

type Params = { id: string };

// Next 15 a veces tipa params como Promise en el build.
// Esto lo hace compatible con ambos casos (objeto o Promise).
export default async function Page({ params }: { params: Params | Promise<Params> }) {
  const resolved = await Promise.resolve(params);

  return (
    <Suspense fallback={null}>
      <MarketplaceByIdClient id={resolved.id} />
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
