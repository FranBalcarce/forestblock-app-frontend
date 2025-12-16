// src/app/new-feature/page.tsx
import { Suspense } from 'react';
import NewFeatureClient from '@/components/new-feature/NewFeatureClient';

export const dynamic = 'force-dynamic';

export default function NewFeaturePage() {
  return (
    <Suspense fallback={null}>
      <NewFeatureClient />
    </Suspense>
  );
}
