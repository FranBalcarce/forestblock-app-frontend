'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import Button from '@/components/Marketplace/Button';
import { useGallery } from '@/hooks/useGallery';

import type { Project } from '@/types/project';
import type { Price, RetireParams } from '@/types/marketplace';

/* ✅ IMPORTANTE
   MapView se importa de forma dinámica para evitar:
   "window is not defined" en SSR (Leaflet)
*/
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
});

// convierte cualquier cosa (Image | Image[] | string | etc) a URL string usable por next/image
const getImageUrl = (img: unknown): string | null => {
  if (!img) return null;

  if (typeof img === 'string') return img;

  if (Array.isArray(img)) {
    for (const item of img) {
      const u = getImageUrl(item);
      if (u) return u;
    }
    return null;
  }

  if (typeof img === 'object') {
    const o = img as Record<string, unknown>;
    const direct = o.url ?? o.src ?? o.imageUrl;
    if (typeof direct === 'string') return direct;

    for (const k of ['banner', 'thumbnail', 'cover', 'image', 'main']) {
      const u = getImageUrl(o[k]);
      if (u) return u;
    }
  }

  return null;
};

type Props = {
  project: Project;
  handleRetire: (params: RetireParams) => void;
  matches: Price[];
  selectedVintage: string;
  displayPrice: string;
  priceParam: string | null;
  isPricesLoading: boolean;
};

export default function ProjectInfo({
  project,
  handleRetire,
  matches,
  selectedVintage,
  displayPrice,
  priceParam,
  isPricesLoading,
}: Props) {
  const router = useRouter();

  // ✅ selector de cantidad
  const [quantity, setQuantity] = useState<number>(1);

  // Cover: primero coverImage, si no la primera de images
  const coverUrl = useMemo(() => {
    return (
      getImageUrl(project.coverImage) ||
      getImageUrl(project.images?.[0]) ||
      getImageUrl(project.images) ||
      null
    );
  }, [project]);

  const { customIcon } = useGallery({
    images: project.images?.length ? [project.images[0]] : [],
  });

  const mapCoords = useMemo<[number, number] | null>(() => {
    const coords = project.location?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;

    const lng = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return [lat, lng];
  }, [project]);

  const canBuy = !isPricesLoading && (matches?.length ?? 0) > 0;

  const onBuy = () => {
    const first = matches?.[0];

    const effectivePriceParam =
      priceParam ?? (first?.purchasePrice != null ? String(first.purchasePrice) : '');

    handleRetire({
      id: project.key,
      index: 0,
      priceParam: effectivePriceParam,
      selectedVintage: selectedVintage || '',
      quantity,
    });
  };

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => q + 1);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10">
      <button
        onClick={() => router.back()}
        className="mb-4 rounded-full bg-black/5 px-4 py-2 text-sm hover:bg-black/10"
      >
        ← Volver
      </button>

      <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
        {/* Header / imagen */}
        <div className="relative h-56 md:h-80 bg-black/5">
          {coverUrl ? (
            <Image src={coverUrl} alt={project.name} fill priority style={{ objectFit: 'cover' }} />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-black/40">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-semibold">{project.name}</h1>

          <p className="mt-3 text-black/70 leading-relaxed">
            {project.description || project.short_description || ''}
          </p>

          <div className="mt-5 text-base font-medium">
            Precio: <span className="font-semibold">${displayPrice}</span> / tCO₂
          </div>

          <div className="mt-6 flex flex-col gap-3 max-w-sm">
            <div className="inline-flex items-center justify-between rounded-2xl border border-black/10 bg-white px-3 py-2">
              <button
                type="button"
                onClick={dec}
                className="h-10 w-10 rounded-xl bg-black/5 hover:bg-black/10 text-lg"
              >
                −
              </button>

              <div className="min-w-16 text-center">
                <div className="text-xs text-black/50">Cantidad</div>
                <div className="text-lg font-semibold">{quantity}</div>
              </div>

              <button
                type="button"
                onClick={inc}
                className="h-10 w-10 rounded-xl bg-black/5 hover:bg-black/10 text-lg"
              >
                +
              </button>
            </div>

            <Button variant="quaternary" isDisabled={!canBuy} onClick={onBuy}>
              {isPricesLoading ? 'Cargando precios...' : 'Comprar / Retirar'}
            </Button>
          </div>

          {/* ✅ MAPA (solo cliente) */}
          {mapCoords && (
            <div className="mt-8">
              <div className="text-lg font-semibold mb-3">Ubicación</div>

              <div className="h-80 rounded-2xl overflow-hidden border border-black/5">
                <MapView
                  projectLocations={[
                    {
                      coordinates: mapCoords,
                      name: project.name,
                    },
                  ]}
                  customIcon={customIcon}
                />
              </div>
            </div>
          )}

          {project.long_description && (
            <div className="mt-8">
              <div className="text-lg font-semibold mb-2">Descripción</div>
              <p className="text-black/70 leading-relaxed whitespace-pre-line">
                {project.long_description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import ProjectHeader from "@/components/ProjectInfo/ProjectHeader";
// import SustainableGoals from "@/components/ProjectInfo/SustainableGoals";
// import RegistryInfo from "@/components/ProjectInfo/RegistryInfo";
// import ListingCard from "@/components/ListingCard/ListingCard";
// import { Project } from "@/types/project";
// import { Match, RetireParams } from "@/types/marketplace";
// import ProjectDescription from "./ProjectDescription";
// import Collapsible from "@/components/Collapsible/Collapsible";
// import StatsCard from "./Stats";
// import Gallery from "./Gallery";
// import TopBar from "../TopBar/TopBar";
// import { useRouter } from "next/navigation";

// const ProjectInfo = ({
//   project,
//   handleRetire,
//   matches,
//   selectedVintage,
//   displayPrice,
//   priceParam,
//   isPricesLoading,
// }: {
//   project: Project;
//   handleRetire: (params: RetireParams) => void;
//   matches: Match[];
//   selectedVintage: string | undefined;
//   displayPrice: string | undefined;
//   priceParam: string | null;
//   isPricesLoading: boolean;
// }) => {
//   const router = useRouter();

//   const location =
//     project?.location?.geometry?.coordinates.length === 2
//       ? {
//           ...project.location,
//           geometry: {
//             ...project.location.geometry,
//             coordinates: [
//               project.location.geometry.coordinates[0],
//               project.location.geometry.coordinates[1],
//             ] as [number, number],
//           },
//         }
//       : null;

//   return (
//     <div className="flex flex-col min-h-screen w-full rounded-xl">
//       <TopBar />
//       <ProjectHeader
//         name={project.name}
//         coverImage={project.coverImage?.url}
//         projectKey={project.key}
//         country={project.country}
//         category={project.methodologies[0].category}
//         methodology={project.methodologies[0].id}
//         methodologyName={project.methodologies[0].name}
//         onGoBack={() => router.back()}
//       />
//       <div className="flex flex-col lg:flex-row flex-grow gap-6 bg-backgroundGray overflow-visible rounded-b-3xl md:px-6 pb-28">
//         <div className="lg:w-3/5 space-y-6 order-2 lg:order-1 md:p-0 px-5">
//           <div>
//             <Collapsible title="Descripción">
//               <ProjectDescription project={project} />
//             </Collapsible>
//           </div>
//           <div>
//             <Collapsible title="Objetivos de Desarrollo Sostenible">
//               <SustainableGoals goals={project.sustainableDevelopmentGoals} />
//             </Collapsible>
//           </div>
//           <div>
//             <Collapsible title="Estadísticas">
//               <StatsCard stats={project.stats} />
//             </Collapsible>
//           </div>
//           {project.images.length > 1 && (
//             <div>
//               <Collapsible title="Galería">
//                 <Gallery images={project.images} location={location} />
//               </Collapsible>
//             </div>
//           )}
//         </div>
//         <div className="lg:w-2/6 md:-mt-16 md:sticky md:top-10 md:h-screen flex flex-col gap-5 order-1 lg:order-2">
//           <ListingCard
//             handleRetire={handleRetire}
//             matches={matches}
//             selectedVintage={selectedVintage}
//             displayPrice={displayPrice}
//             priceParam={priceParam}
//             isPricesLoading={isPricesLoading}
//           />
//           <RegistryInfo url={project.url} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectInfo;
