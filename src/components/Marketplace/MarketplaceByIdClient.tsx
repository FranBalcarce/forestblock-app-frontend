'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import type { Price } from '@/types/marketplace';

// Helpers (tipados)
const getProjectKeyFromPrice = (p: Price): string | undefined => {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
};

type Props = { id: string };

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price');

  // IMPORTANTE: acá NO normalizamos. El id de la ruta es "VCS-844"
  // y así viene también en prices (projectId: "VCS-...")
  const { project, loading, handleRetire, prices, isPricesLoading } = useMarketplace(id);

  // Loading / error states
  if (loading) return <LoaderScreenDynamic />;

  if (!project) {
    return (
      <div className="w-full p-10 flex flex-col gap-2 items-center justify-center">
        <p className="text-[20px] font-aeonik text-forestGreen">Proyecto no encontrado</p>
        <p className="text-customGray font-neueMontreal">ID recibido: {id}</p>
        <p className="text-customGray font-neueMontreal">
          Probá volver al marketplace o revisá que el ID coincida con <b>project.key</b> (ej:
          VCS-844).
        </p>
      </div>
    );
  }

  const matches = useMemo(() => {
    return (prices ?? []).filter((p) => getProjectKeyFromPrice(p) === project.key);
  }, [prices, project.key]);

  const selectedPriceObj = useMemo(() => {
    if (!priceParam) return null;
    return matches.find((p) => String(p.purchasePrice) === String(priceParam)) ?? null;
  }, [matches, priceParam]);

  const displayPrice = useMemo(() => {
    if (selectedPriceObj) return selectedPriceObj.purchasePrice.toFixed(2);

    // fallback: si tu Project trae displayPrice/price
    const p =
      (project as unknown as { displayPrice?: string; price?: string }).displayPrice ??
      (project as unknown as { price?: string }).price ??
      '';

    return p;
  }, [project, selectedPriceObj]);

  const selectedVintage = useMemo(() => {
    if (selectedPriceObj) {
      return (
        selectedPriceObj.listing?.creditId?.vintage?.toString() ||
        selectedPriceObj.carbonPool?.creditId?.vintage?.toString() ||
        ''
      );
    }
    // fallback si tu Project guarda selectedVintage
    return (project as unknown as { selectedVintage?: string }).selectedVintage ?? '';
  }, [project, selectedPriceObj]);

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
