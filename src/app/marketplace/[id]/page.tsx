import { Suspense } from 'react';
import MarketplaceByIdClient from '@/components/Marketplace/MarketplaceByIdClient';

export const dynamic = 'force-dynamic';

export default function MarketplaceByIdPage() {
  return (
    <Suspense fallback={null}>
      <MarketplaceByIdClient />
    </Suspense>
  );
}
