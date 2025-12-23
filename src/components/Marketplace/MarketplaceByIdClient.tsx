'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import { Price } from '@/types/marketplace';

type Props = { id: string };

const getProjectIdFromPrice = (p: Price): string | undefined => {
  // En tu response: listing.creditId.projectId viene tipo "VCS-191"
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
};

const normalizeProjectKeyToId = (key?: string | null): string => {
  if (!key) return '';
  // "VCS-844" -> "844"
  const parts = key.split('-');
  const last = parts[parts.length - 1];
  return last ?? key;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price');

  const { project, handleRetire, prices, isPricesLoading } = useMarketplace(id);

  if (!project) return <LoaderScreenDynamic />;

  // ✅ IDs posibles del proyecto (para matchear correctamente prices)
  const projectIdFromKey = normalizeProjectKeyToId(project.key); // "844"
  const projectIdFromField =
    (project as any).projectID?.toString?.() ?? (project as any).projectId?.toString?.() ?? ''; // "844" si existe en tu tipo

  const acceptableIds = new Set(
    [project.key, projectIdFromKey, projectIdFromField].filter(Boolean)
  );

  // ✅ matches correctos
  const matches =
    prices?.filter((p) => {
      const pid = getProjectIdFromPrice(p);
      if (!pid) return false;

      // pid puede venir "VCS-844" o "844" dependiendo backend
      const pidNormalized = normalizeProjectKeyToId(pid);

      return acceptableIds.has(pid) || acceptableIds.has(pidNormalized);
    }) ?? [];

  // ✅ si viene ?price=... lo usamos para elegir un match específico
  const selectedPriceObj = priceParam
    ? matches.find((p) => String(p.purchasePrice) === String(priceParam))
    : null;

  // ✅ precio a mostrar: si hay matches, priorizamos el purchasePrice del primer match
  const baseMatch = selectedPriceObj ?? matches[0] ?? null;

  const displayPrice = baseMatch
    ? baseMatch.purchasePrice.toFixed(2)
    : (project as any).displayPrice ?? (project as any).price ?? '';

  const selectedVintage = baseMatch
    ? baseMatch.listing?.creditId?.vintage?.toString() ||
      baseMatch.carbonPool?.creditId?.vintage?.toString() ||
      ''
    : (project as any).selectedVintage ?? '';

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
