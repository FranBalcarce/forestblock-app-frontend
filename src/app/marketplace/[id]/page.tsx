// src/app/marketplace/[id]/page.tsx
import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

export default async function MarketplaceByIdPage({ params }: { params: Promise<{ id: string }> }) {
  // ⚠️ Acá desestructuramos el id esperando el Promise
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
