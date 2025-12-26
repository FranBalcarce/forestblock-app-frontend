'use client';

import Image from 'next/image';
import useMarketplace from '@/hooks/useMarketplace';
import ListingItem from '../ListingCard/ListingItem';
import LoaderScreenDynamic from '../LoaderScreen/LoaderScreenDynamic';

interface Props {
  id: string;
}

export default function MarketplaceByIdClient({ id }: Props) {
  const { project, prices, isPricesLoading, loading, handleRetire } = useMarketplace(id);

  if (loading || isPricesLoading) return <LoaderScreenDynamic />;

  if (!project) return <p className="text-center mt-10 text-gray-500">Proyecto no encontrado</p>;

  const matches = prices.filter(
    (p) => (p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId) === project.key
  );

  const displayPrice = project.displayPrice ?? '0';
  const selectedVintage = project.selectedVintage ?? '0';

  return (
    <div className="w-full flex flex-col items-center gap-10 pb-20">
      {/* Imagen */}
      <div className="w-full flex justify-center items-center bg-gray-100 h-[380px] rounded-xl overflow-hidden">
        {project.images?.[0]?.url ? (
          <Image
            src={project.images[0].url}
            width={800}
            height={400}
            alt={project.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <p className="text-gray-500">Sin imagen</p>
        )}
      </div>

      {/* Info */}
      <div className="max-w-[900px] w-full">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-gray-700 mt-2">{project.description}</p>
      </div>

      {/* Precios */}
      <div className="max-w-[900px] w-full">
        <h2 className="text-2xl font-bold mb-4">Precio</h2>

        <ListingItem
          handleRetire={handleRetire}
          matches={matches}
          displayPrice={displayPrice}
          priceParam={displayPrice}
          selectedVintage={selectedVintage}
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
