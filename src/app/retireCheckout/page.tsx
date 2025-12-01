import { Suspense } from 'react';
import RetireCheckoutClient from '@/components/retireCheckout/RetireCheckoutClient';

export const dynamic = 'force-dynamic';

export default function RetireCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <RetireCheckoutClient />
    </Suspense>
  );
}
