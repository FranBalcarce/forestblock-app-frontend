import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { id: string };
};

export default function MarketplaceByIdPage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      {/* el client usa useParams, pero igual pasamos id si después lo querés usar */}
      <MarketplaceByIdClient />
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
