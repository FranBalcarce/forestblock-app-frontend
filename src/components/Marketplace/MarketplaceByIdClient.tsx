'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import type { Price } from '@/types/marketplace';

type Props = { id: string };

const getProjectIdFromPrice = (p: Price): string | undefined => {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price');

  const { project, loading, handleRetire, prices, isPricesLoading } = useMarketplace(id);

  if (loading) return <LoaderScreenDynamic />;

  if (!project) {
    const normalized = id.replace(/\D/g, '') || id;
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Proyecto no encontrado</h2>
        <p className="text-sm text-gray-500 mt-2">
          ID recibido: {id} — Normalizado: {normalized}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Probá volver al marketplace o revisá que el ID coincida con el que devuelve la API.
        </p>
      </div>
    );
  }

  const matches = prices?.filter((p) => getProjectIdFromPrice(p) === project.key) ?? [];

  const selectedPriceObj = priceParam
    ? matches.find((p) => String(p.purchasePrice) === String(priceParam))
    : null;

  const displayPrice = selectedPriceObj
    ? selectedPriceObj.purchasePrice.toFixed(2)
    : project.displayPrice ?? project.price ?? '';

  const selectedVintage = selectedPriceObj
    ? selectedPriceObj.listing?.creditId?.vintage?.toString() ||
      selectedPriceObj.carbonPool?.creditId?.vintage?.toString() ||
      ''
    : project.selectedVintage ?? '';

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
