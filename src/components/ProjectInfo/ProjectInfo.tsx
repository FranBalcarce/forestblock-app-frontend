'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import MapView from './MapView';
import Button from '@/components/Marketplace/Button';
import { useGallery } from '@/hooks/useGallery';

import type { Project } from '@/types/project';
import type { Price, RetireParams } from '@/types/marketplace';

type Props = {
  project: Project;
  handleRetire: (params: RetireParams) => void;
  matches: Price[];
  selectedVintage: string;
  displayPrice: string;
  priceParam: string | null;
  isPricesLoading: boolean;
};

const getImageUrl = (img: unknown): string | null => {
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (Array.isArray(img)) return getImageUrl(img[0]);
  if (typeof img === 'object' && img !== null) {
    const o = img as Record<string, unknown>;
    if (typeof o.url === 'string') return o.url;
  }
  return null;
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
  const [quantity, setQuantity] = useState(1);

  const coverUrl = useMemo(() => {
    return getImageUrl(project.coverImage) || getImageUrl(project.images?.[0]) || null;
  }, [project]);

  const { customIcon } = useGallery({
    images: [project.images?.[0]],
  });

  const mapCoords = useMemo<[number, number] | null>(() => {
    const coords = project.location?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;
    return [coords[1], coords[0]];
  }, [project]);

  const onBuy = () => {
    const first = matches?.[0];
    const effectivePriceParam =
      priceParam ?? (first?.purchasePrice != null ? String(first.purchasePrice) : '');

    handleRetire({
      id: project.key,
      index: 0,
      priceParam: effectivePriceParam,
      selectedVintage,
    });
  };

  const canBuy = !isPricesLoading && matches.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 rounded-full bg-black/5 px-4 py-2 text-sm hover:bg-black/10"
      >
        ← Volver
      </button>

      <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
        <div className="relative h-56 md:h-80 bg-black/5">
          {coverUrl ? (
            <Image src={coverUrl} alt={project.name} fill priority style={{ objectFit: 'cover' }} />
          ) : (
            <div className="h-full flex items-center justify-center text-black/40">Sin imagen</div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-semibold">{project.name}</h1>

          <p className="mt-3 text-black/70">{project.description || project.short_description}</p>

          <div className="mt-5 text-lg font-medium">
            Precio: <span className="font-semibold">${displayPrice}</span> / tCO₂
          </div>

          {/* SELECTOR DE CANTIDAD */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-full border text-lg"
            >
              –
            </button>

            <span className="min-w-[40px] text-center font-semibold">{quantity}</span>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="h-10 w-10 rounded-full border text-lg"
            >
              +
            </button>
          </div>

          <div className="mt-6">
            <Button variant="quaternary" isDisabled={!canBuy} onClick={onBuy}>
              {isPricesLoading ? 'Cargando precios...' : 'Comprar / Retirar'}
            </Button>
          </div>

          {mapCoords && (
            <div className="mt-8">
              <div className="font-semibold mb-3">Ubicación</div>
              <div className="h-80 rounded-2xl overflow-hidden border">
                <MapView
                  projectLocations={[{ coordinates: mapCoords, name: project.name }]}
                  customIcon={customIcon}
                />
              </div>
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
