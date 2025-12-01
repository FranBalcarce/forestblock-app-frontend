import { Suspense } from 'react';
import RetirementStepsUI from '@/components/retirementSteps/RetirementStepsClient';

export const dynamic = 'force-dynamic';

export default function RetirementStepsPage() {
  return (
    <Suspense fallback={null}>
      <RetirementStepsUI />
    </Suspense>
  );
}
