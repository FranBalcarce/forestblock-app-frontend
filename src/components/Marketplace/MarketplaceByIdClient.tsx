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

const getProjectKeyFromPrice = (p: Price): string | undefined =>
  p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price');

  // 👉 todos los hooks arriba, sin condicionales
  const { project, handleRetire, prices, isPricesLoading, loading } = useMarketplace(id);

  // ⏳ estado cargando
  if (loading && !project) {
    return <LoaderScreenDynamic />;
  }

  // ❌ proyecto no encontrado (esto es lo mismo que veías antes)
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

  // 🎯 matchear precios del proyecto actual
  const matches = prices?.filter((p) => getProjectKeyFromPrice(p) === project.key) ?? [];

  const selectedPriceObj = priceParam
    ? matches.find((p) => String(p.purchasePrice) === String(priceParam))
    : null;

  const displayPrice = selectedPriceObj
    ? selectedPriceObj.purchasePrice.toFixed(2)
    : project.displayPrice ?? project.price ?? '0';

  const selectedVintage =
    selectedPriceObj?.listing?.creditId?.vintage?.toString() ??
    selectedPriceObj?.carbonPool?.creditId?.vintage?.toString() ??
    project.selectedVintage ??
    '';

  // 👇 acá NO cambiamos el layout: lo decide totalmente ProjectInfo
  return (
    <ProjectInfo
      project={project}
      handleRetire={handleRetire}
      matches={matches}
      selectedVintage={selectedVintage}
      displayPrice={displayPrice}
      priceParam={priceParam}
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
