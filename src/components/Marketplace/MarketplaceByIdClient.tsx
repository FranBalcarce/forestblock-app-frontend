'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import type { Price } from '@/types/marketplace';

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const selectedVintage = searchParams.get('selectedVintage') ?? '';

  const { project, prices, isPricesLoading, handleRetire } = useMarketplace(id);

  // ✅ SOLO listings válidos de Carbonmark
  const listings: Price[] = useMemo(() => {
    if (!project) return [];

    return prices.filter(
      (p) =>
        p.type === 'listing' &&
        typeof p.purchasePrice === 'number' &&
        (p.listing?.creditId?.projectId === project.key ||
          p.carbonPool?.creditId?.projectId === project.key)
    );
  }, [prices, project]);

  // ✅ Precio real (Carbonmark)
  const displayPrice = useMemo(() => {
    if (!listings.length) return '—';

    const min = Math.min(...listings.map((l) => l.purchasePrice!));
    return min.toFixed(2);
  }, [listings]);

  if (!project) return null;

  return (
    <ProjectInfo
      project={project}
      matches={listings}
      displayPrice={displayPrice}
      selectedVintage={selectedVintage}
      priceParam={displayPrice !== '—' ? displayPrice : null}
      handleRetire={handleRetire}
      isPricesLoading={isPricesLoading}
    />
  );
}

// 'use client';

// import React from 'react';
// import { useSearchParams } from 'next/navigation';
// import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
// import useMarketplace from '@/hooks/useMarketplace';
// import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
// import { Price } from '@/types/marketplace';

// type Props = { id: string };

// const getProjectIdFromPrice = (p: Price): string | undefined => {
//   return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
// };

// export default function MarketplaceByIdClient({ id }: Props) {
//   const searchParams = useSearchParams();
//   const priceParam = searchParams.get('price');

//   const { project, handleRetire, prices, isPricesLoading } = useMarketplace(id);

//   if (!project) return <LoaderScreenDynamic />;

//   const matches = prices?.filter((p) => getProjectIdFromPrice(p) === project.key) ?? [];

//   const selectedPriceObj = priceParam
//     ? matches.find((p) => String(p.purchasePrice) === String(priceParam))
//     : null;

//   const displayPrice = selectedPriceObj
//     ? selectedPriceObj.purchasePrice.toFixed(2)
//     : project.displayPrice ?? project.price ?? '';

//   const selectedVintage = selectedPriceObj
//     ? selectedPriceObj.listing?.creditId?.vintage?.toString() ||
//       selectedPriceObj.carbonPool?.creditId?.vintage?.toString() ||
//       ''
//     : project.selectedVintage ?? '';

//   return (
//     <div className="flex gap-10 p-5 overflow-hidden md:overflow-visible min-h-screen">
//       <ProjectInfo
//         project={project}
//         handleRetire={handleRetire}
//         matches={matches}
//         selectedVintage={selectedVintage}
//         displayPrice={displayPrice}
//         priceParam={priceParam}
//         isPricesLoading={isPricesLoading}
//       />
//     </div>
//   );
// }
