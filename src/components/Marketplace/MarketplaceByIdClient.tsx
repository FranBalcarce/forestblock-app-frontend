'use client';

import { useMemo } from 'react';
import Image from 'next/image';

import useMarketplace from '@/hooks/useMarketplace';
import ListingItem from '../ListingCard/ListingItem';
import type { Price } from '@/types/marketplace';

interface Props {
  id: string;
}

// Helper local para matchear precios por proyecto
function getProjectKeyFromPrice(p: Price): string | undefined {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
}

export default function MarketplaceByIdClient({ id }: Props) {
  const { project, prices, isPricesLoading, handleRetire } = useMarketplace(id);

  // Si todavía no tenemos el proyecto, mostramos loading
  if (!project) {
    return (
      <div className="flex justify-center items-center py-20">
        <p>Cargando proyecto...</p>
      </div>
    );
  }

  // ========================= IMAGEN SEGURA =========================
  const rawImage = project.images?.[0];
  const imageSrc = typeof rawImage === 'string' ? rawImage : rawImage?.url || '/placeholder.png'; // tu tipo Image solo tiene url / caption

  // ========================= VINTAGE POR DEFECTO ===================
  const selectedVintage = project.vintages?.[0] ?? '0';

  // ========================= MATCHES DE PRECIOS ====================
  const matches = useMemo(
    () => prices.filter((p) => getProjectKeyFromPrice(p) === project.key),
    [prices, project.key]
  );

  // ========================= PRECIO BASE ===========================
  // Tomamos el menor precio disponible de los matches,
  // y si no hay, usamos el displayPrice del proyecto o price plano.
  const basePriceNumber: number = (() => {
    if (matches.length > 0) {
      const first = matches[0];
      const val = first.purchasePrice ?? first.baseUnitPrice;
      if (typeof val === 'number' && Number.isFinite(val)) return val;
    }

    const parsed = Number(project.displayPrice ?? project.price ?? '0');

    return Number.isFinite(parsed) ? parsed : 0;
  })();

  // ========================= +15% MÁRGEN ===========================
  const finalPriceNumber = basePriceNumber * 1.15; // +15%
  const displayPrice = finalPriceNumber.toFixed(2);
  const priceParam = displayPrice; // lo mandamos así al checkout

  return (
    <div className="flex flex-col gap-10 p-5 overflow-hidden md:overflow-visible min-h-screen">
      {/* ============================== IMAGEN ============================== */}
      <div className="flex-1">
        <Image
          src={imageSrc}
          width={900}
          height={500}
          alt={project.name}
          className="object-cover rounded-xl w-full h-[380px]"
        />
      </div>

      {/* ============================== INFO PROYECTO ======================= */}
      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-gray-700 max-w-[900px] mt-3 leading-relaxed">{project.description}</p>
      </div>

      {/* ============================== PRECIOS / RETIRO ==================== */}
      <div className="mt-6">
        <ListingItem
          handleRetire={handleRetire}
          matches={matches}
          displayPrice={displayPrice}
          selectedVintage={selectedVintage}
          priceParam={priceParam}
          isPricesLoading={isPricesLoading}
        />
      </div>
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
