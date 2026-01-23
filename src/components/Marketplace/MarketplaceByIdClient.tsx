'use client';

import { useMemo } from 'react';
import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import type { Price } from '@/types/marketplace';

/* ---------------------------------------------
   Type guard (OBLIGATORIO)
--------------------------------------------- */

function isListingPrice(p: Price): p is Price & {
  listing: { creditId: { projectId: string } };
  purchasePrice: number;
  supply: number;
} {
  return (
    p.type === 'listing' &&
    typeof p.purchasePrice === 'number' &&
    typeof p.supply === 'number' &&
    !!p.listing?.creditId?.projectId
  );
}

/* ---------------------------------------------
   Props
--------------------------------------------- */

type Props = {
  id: string;
};

/* ---------------------------------------------
   Component
--------------------------------------------- */

export default function MarketplaceByIdClient({ id }: Props) {
  const { project, prices, isPricesLoading, handleRetire } = useMarketplace(id);

  /* ---------- Listings del proyecto (solo con stock) ---------- */
  const listings: Price[] = useMemo(() => {
    if (!project) return [];

    return prices
      .filter(isListingPrice)
      .filter((p) => p.supply > 0 && p.listing.creditId.projectId === project.key);
  }, [prices, project]);

  /* ---------- Precio más bajo ---------- */
  const displayPrice: string | null = useMemo(() => {
    if (!listings.length) return null;

    const min = Math.min(...listings.map((l) => l.purchasePrice));
    return min.toFixed(2);
  }, [listings]);

  if (!project) return null;

  return (
    <ProjectInfo
      project={project}
      matches={listings}
      displayPrice={displayPrice}
      selectedVintage=""
      priceParam={displayPrice}
      handleRetire={handleRetire}
      isPricesLoading={isPricesLoading}
    />
  );
}
