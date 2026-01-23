'use client';

import { useMemo } from 'react';
import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import { Price } from '@/types/marketplace';

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const { project, prices, isPricesLoading, handleRetire } = useMarketplace(id);

  const listings: Price[] = useMemo(() => {
    if (!project) return [];

    return prices.filter(
      (p) => p.type === 'listing' && p.supply > 0 && p.listing?.creditId?.projectId === project.key
    );
  }, [prices, project]);

  const displayPrice = useMemo(() => {
    if (!listings.length) return '—';
    return Math.min(...listings.map((l) => l.purchasePrice)).toFixed(2);
  }, [listings]);

  if (!project) return null;

  return (
    <ProjectInfo
      project={project}
      matches={listings}
      displayPrice={displayPrice}
      selectedVintage=""
      priceParam={displayPrice !== '—' ? displayPrice : null}
      handleRetire={handleRetire}
      isPricesLoading={isPricesLoading}
    />
  );
}
