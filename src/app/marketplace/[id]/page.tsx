import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

type Params = { id: string };

export default async function MarketplaceByIdPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <MarketplaceByIdClient id={id} />
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
