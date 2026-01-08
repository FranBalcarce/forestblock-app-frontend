'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import type { Price } from '@/types/marketplace';

type Props = {
  id: string;
};

// ✅ markup del 15% (solo para UI / checkout final)
const MARKUP = 1.15;

const getProjectKeyFromPrice = (p: Price): string | undefined =>
  p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParamRaw = searchParams.get('price'); // ✅ SIEMPRE RAW (sin 15%)

  // ✅ hooks arriba, sin condicionales
  const { project, handleRetire, prices, isPricesLoading, loading } = useMarketplace(id);

  if (loading && !project) {
    return <LoaderScreenDynamic />;
  }

  if (!project) {
    const normalized = id.replace(/^VCS-/, '');
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px] p-4">
        <div className="text-center max-w-xl">
          <h1 className="text-xl font-semibold mb-2">Proyecto no encontrado</h1>
          <p className="text-gray-600 text-sm">
            ID recibido: <strong>{id}</strong> — Normalizado: <strong>{normalized}</strong>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Probá volver al marketplace o revisá que el ID coincida con el que devuelve la API.
          </p>
        </div>
      </div>
    );
  }

  // ✅ precios del proyecto actual
  const matches = prices?.filter((p) => getProjectKeyFromPrice(p) === project.key) ?? [];

  // Buscar el precio seleccionado por query param (RAW)
  const selectedPriceObj =
    priceParamRaw && matches.length
      ? matches.find((p) => Number(p.purchasePrice).toFixed(2) === Number(priceParamRaw).toFixed(2))
      : null;

  // ✅ raw base (sin markup)
  const rawBase =
    selectedPriceObj?.purchasePrice ??
    (Number.isFinite(Number(project.displayPrice)) ? Number(project.displayPrice) : 0);

  // ✅ precio final (con markup) para mostrar
  const displayPrice = (rawBase * MARKUP).toFixed(2);

  const selectedVintage =
    selectedPriceObj?.listing?.creditId?.vintage?.toString() ??
    selectedPriceObj?.carbonPool?.creditId?.vintage?.toString() ??
    project.selectedVintage ??
    '';

  return (
    <ProjectInfo
      project={project}
      handleRetire={handleRetire}
      matches={matches}
      selectedVintage={selectedVintage}
      displayPrice={displayPrice} // ✅ con 15% para UI
      priceParam={priceParamRaw} // ✅ RAW para matchear y para retiro
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
