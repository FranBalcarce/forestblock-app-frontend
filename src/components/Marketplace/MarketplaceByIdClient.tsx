'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';

import type { Price } from '@/types/marketplace';

type Props = {
  id: string;
};

const getProjectIdFromPrice = (p: Price): string | undefined => {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
};

export default function MarketplaceByIdClient({ id }: Props): JSX.Element {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price');

  const { project, handleRetire, prices, isPricesLoading, loading } = useMarketplace(id);

  if (loading && !project) {
    return <LoaderScreenDynamic />;
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-customGray">Proyecto no encontrado. ID recibido: {id}</p>
      </div>
    );
  }

  const matches: Price[] = prices.filter((p: Price) => getProjectIdFromPrice(p) === project.key);

  const selectedPriceObj: Price | null = priceParam
    ? matches.find((p: Price) => String(p.purchasePrice) === String(priceParam)) ?? null
    : null;

  const displayPrice =
    selectedPriceObj?.purchasePrice?.toFixed(2) ?? project.displayPrice ?? project.price ?? '0';

  const selectedVintage =
    selectedPriceObj?.listing?.creditId?.vintage?.toString() ||
    selectedPriceObj?.carbonPool?.creditId?.vintage?.toString() ||
    project.selectedVintage ||
    '';

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
