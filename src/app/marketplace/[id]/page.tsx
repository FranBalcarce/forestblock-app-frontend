// src/app/marketplace/[id]/page.tsx
import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

type MarketplacePageProps = {
  params: {
    id: string;
  };
};

export default function MarketplaceByIdPage({ params }: MarketplacePageProps) {
  const { id } = params;

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
