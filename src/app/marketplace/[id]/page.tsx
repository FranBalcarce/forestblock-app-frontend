import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

export default function MarketplaceByIdPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={null}>
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
