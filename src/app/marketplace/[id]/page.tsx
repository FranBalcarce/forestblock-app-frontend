import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

type Props = {
  params: { id: string };
  searchParams: { price?: string };
};

export default function MarketplaceByIdPage({ params, searchParams }: Props) {
  const { id } = params;
  const priceParam = searchParams?.price ?? null;

  return (
    <Suspense fallback={null}>
      <MarketplaceByIdClient id={id} priceParam={priceParam} />
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
