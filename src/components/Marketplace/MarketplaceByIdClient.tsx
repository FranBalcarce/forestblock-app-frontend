'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import type { Price } from '@/types/marketplace';

type Props = { id: string };

// misma normalización que en el hook
const normalizeProjectKey = (raw?: string | number | null): string | undefined => {
  if (raw === undefined || raw === null) return undefined;
  const s = String(raw);
  if (s.startsWith('VCS-')) return s;
  return `VCS-${s}`;
};

const getProjectIdFromPrice = (p: Price): string | undefined => {
  const raw = p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
  return normalizeProjectKey(raw);
};

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price');

  // 👉 usamos el hook global SIN pasar id
  const { projects, handleRetire, prices, isPricesLoading, loading } = useMarketplace();

  const normalizedRouteKey = normalizeProjectKey(id);

  const project = useMemo(
    () => projects.find((p) => normalizeProjectKey(p.key) === normalizedRouteKey) ?? null,
    [projects, normalizedRouteKey]
  );

  if (loading) return <LoaderScreenDynamic />;

  if (!project) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
        <div className="text-center text-customGray">
          <p className="text-[23px] font-aeonik">Proyecto no encontrado</p>
          <p className="text-[14px] font-neueMontreal mt-2">
            ID recibido: {id} — Normalizado: {normalizedRouteKey ?? 'N/A'}
          </p>
          <p className="text-[14px] font-neueMontreal mt-1">
            Probá volver al marketplace o revisá que el ID coincida con el que devuelve la API.
          </p>
        </div>
      </div>
    );
  }

  // 🔍 prices que matchean con este proyecto
  const matches = useMemo(
    () => prices.filter((p) => getProjectIdFromPrice(p) === normalizeProjectKey(project.key)),
    [prices, project.key]
  );

  // debug opcional
  console.log('PROJECT DETAIL', {
    projectKey: project.key,
    matches: matches.length,
    firstMatch: matches[0],
  });

  const selectedPriceObj = priceParam
    ? matches.find((p) => String(p.purchasePrice) === String(priceParam)) ?? null
    : matches[0] ?? null;

  const displayPrice = selectedPriceObj
    ? selectedPriceObj.purchasePrice.toFixed(2)
    : project.displayPrice ?? project.price ?? '0';

  const selectedVintage = selectedPriceObj
    ? (
        selectedPriceObj.listing?.creditId?.vintage ??
        selectedPriceObj.carbonPool?.creditId?.vintage
      )?.toString() ?? ''
    : project.selectedVintage ?? project.vintages?.[0] ?? '';

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
