'use client';

import { useMemo } from 'react';
import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import type { Price } from '@/types/marketplace';

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const { project, prices, isPricesLoading, handleRetire } = useMarketplace(id);

  /**
   * Listings válidos para ESTE proyecto
   */
  const listings = useMemo<Price[]>(() => {
    if (!project) return [];

    return prices.filter(
      (p): p is Price =>
        p.type === 'listing' &&
        typeof p.purchasePrice === 'number' &&
        p.supply > 0 &&
        p.listing?.creditId?.projectId === project.key
    );
  }, [prices, project]);

  /**
   * Precio a mostrar = el más barato del proyecto
   */
  const displayPrice = useMemo<string>(() => {
    if (!listings.length) return '—';

    const minPrice = Math.min(...listings.map((l) => l.purchasePrice));
    return minPrice.toFixed(2);
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
