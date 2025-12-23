// src/components/Marketplace/MarketplaceByIdClient.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import type { Price } from '@/types/marketplace';
import type { Project } from '@/types/project';

type Props = { id: string };

const getProjectIdFromPrice = (p: Price): string | undefined => {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
};

const getVintageFromPrice = (p: Price): string | undefined => {
  const v = p.listing?.creditId?.vintage ?? p.carbonPool?.creditId?.vintage;
  return v != null ? String(v) : undefined;
};

const getProjectIdCandidates = (project: Project): string[] => {
  // En tu JSON vi project.key = "VCS-844" y project.projectID = "844"
  // En prices a veces viene "VCS-191" u otro id, por eso armamos candidatos típicos.
  const key = project.key ? String(project.key) : '';
  const projectID = (project as { projectID?: string | number }).projectID;
  const pid = projectID != null ? String(projectID) : '';

  const candidates = new Set<string>();
  if (key) candidates.add(key);
  if (pid) candidates.add(pid);
  if (pid) candidates.add(`VCS-${pid}`);

  // por las dudas, si el key viniera sin prefijo
  if (key.startsWith('VCS-')) candidates.add(key.replace('VCS-', ''));

  return Array.from(candidates).filter(Boolean);
};

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price'); // string | null

  const { project, handleRetire, prices, isPricesLoading } = useMarketplace(id);

  if (!project) return <LoaderScreenDynamic />;

  // ✅ Matching robusto (sin any)
  const candidates = getProjectIdCandidates(project);

  const matches =
    prices?.filter((p: Price) => {
      const pid = getProjectIdFromPrice(p);
      return pid ? candidates.includes(pid) : false;
    }) ?? [];

  // si te pasan ?price=... elegimos el objeto que matchee ese precio
  const selectedPriceObj: Price | null = priceParam
    ? matches.find((p: Price) => String(p.purchasePrice) === String(priceParam)) ?? null
    : null;

  const displayPrice: string =
    selectedPriceObj != null
      ? Number(selectedPriceObj.purchasePrice).toFixed(2)
      : (project as { displayPrice?: string }).displayPrice ??
        (project as { price?: string }).price ??
        '';

  const selectedVintage: string =
    selectedPriceObj != null
      ? getVintageFromPrice(selectedPriceObj) ?? ''
      : (project as { selectedVintage?: string }).selectedVintage ?? '';

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
