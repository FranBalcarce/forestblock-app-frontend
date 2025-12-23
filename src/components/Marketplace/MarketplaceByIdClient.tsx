// src/components/Marketplace/MarketplaceByIdClient.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import type { Price } from '@/types/marketplace';

type Props = { id: string };

const normalizeProjectKey = (rawId: string): string => {
  // Si ya viene "VCS-844", lo dejamos
  if (rawId.includes('-')) return rawId.toUpperCase();

  // Si viene "844", lo transformamos a "VCS-844"
  return `VCS-${rawId}`.toUpperCase();
};

const getProjectKeyFromPrice = (p: Price): string | undefined => {
  // v18: listing.creditId.projectId
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price'); // purchasePrice

  const normalizedKey = normalizeProjectKey(id);

  // OJO: tu hook useMarketplace(id) quizás esperaba "id" sin normalizar.
  // Si tu hook busca por project.key, pasale normalizedKey.
  const { project, handleRetire, prices, isPricesLoading } = useMarketplace(normalizedKey);

  if (!project) return <LoaderScreenDynamic />;

  // Matchear precios con el project.key (ej "VCS-844")
  const matches = (prices ?? []).filter((p) => getProjectKeyFromPrice(p) === project.key);

  const selectedPriceObj = priceParam
    ? matches.find((p) => String(p.purchasePrice) === String(priceParam))
    : undefined;

  const displayPrice = selectedPriceObj
    ? selectedPriceObj.purchasePrice.toFixed(2)
    : (project as unknown as { displayPrice?: string }).displayPrice ?? project.price ?? '';

  const selectedVintage = selectedPriceObj
    ? String(
        selectedPriceObj.listing?.creditId?.vintage ??
          selectedPriceObj.carbonPool?.creditId?.vintage ??
          ''
      )
    : (project as unknown as { selectedVintage?: string }).selectedVintage ?? '';

  return (
    <div className="flex gap-10 p-5 overflow-hidden md:overflow-visible min-h-screen">
      <ProjectInfo
        project={project}
        handleRetire={handleRetire}
        matches={matches}
        selectedVintage={selectedVintage}
        displayPrice={displayPrice}
        priceParam={priceParam}
        isPricesLoading={isPricesLoading}
      />
    </div>
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
