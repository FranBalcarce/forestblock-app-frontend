// src/app/marketplace/[id]/page.tsx
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

type MarketplacePageProps = {
  params: {
    id: string;
  };
};

export default function MarketplaceByIdPage({ params }: MarketplacePageProps) {
  return <MarketplaceByIdClient id={params.id} />;
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
