'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import useMarketplace from '@/hooks/useMarketplace';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import type { Price } from '@/types/marketplace';

// 🔹 mismo markup del 15%
const MARKUP = 1.15;

type Props = {
  id: string;
};

const getProjectIdFromPrice = (p: Price): string | undefined => {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price'); // este viene en precio base (Carbonmark)

  const { project, handleRetire, prices, isPricesLoading, loading } = useMarketplace(id);

  // Mientras carga projects o no hay project, mostramos loader
  if (loading || !project) {
    return <LoaderScreenDynamic />;
  }

  // Filtramos los prices que pertenecen al proyecto
  const matches: Price[] = useMemo(() => {
    return prices.filter((p) => getProjectIdFromPrice(p) === project.key);
  }, [prices, project.key]);

  // Elegimos un price según el query param (base) si existe
  const selectedPriceObj: Price | null = useMemo(() => {
    if (!priceParam) return null;
    return matches.find((p) => String(p.purchasePrice) === String(priceParam)) ?? null;
  }, [matches, priceParam]);

  // Calculamos el precio a mostrar CON el 15%
  const displayPrice: string = useMemo(() => {
    const convert = (base: number) => (base * MARKUP).toFixed(2);

    // 1) Si viene price (base) por query => lo usamos
    if (priceParam && !Number.isNaN(Number(priceParam))) {
      return convert(Number(priceParam));
    }

    // 2) Si tenemos matches => usamos el menor purchasePrice
    if (matches.length) {
      const bases = matches
        .map((m) => m.purchasePrice)
        .filter((n): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0);

      if (bases.length) {
        const minBase = Math.min(...bases);
        return convert(minBase);
      }
    }

    // 3) Fallback: si el project ya tiene displayPrice (que ya incluye markup),
    // lo usamos tal cual para no volver a multiplicar
    if (project.displayPrice) return project.displayPrice;

    return '0.00';
  }, [matches, priceParam, project.displayPrice]);

  // Vintage seleccionado
  const selectedVintage: string = useMemo(() => {
    if (selectedPriceObj) {
      const v1 = selectedPriceObj.listing?.creditId?.vintage;
      const v2 = selectedPriceObj.carbonPool?.creditId?.vintage;
      if (v1 != null) return String(v1);
      if (v2 != null) return String(v2);
    }

    // fallback: el que traiga el project
    return project.selectedVintage ?? '';
  }, [project.selectedVintage, selectedPriceObj]);

  return (
    <div className="flex gap-10 p-5 overflow-hidden md:overflow-visible min-h-screen">
      <ProjectInfo
        project={project}
        handleRetire={handleRetire}
        matches={matches}
        selectedVintage={selectedVintage}
        displayPrice={displayPrice}
        priceParam={priceParam || null} // <<---- FIX
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
