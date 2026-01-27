import { Project } from '@/types/project';
import Image from 'next/image';
import React from 'react';

const RightDetails = ({ project }: { project: Project | null }) => {
  // ✅ Imagen segura (TS + build)
  const imageUrl =
    project?.images?.[0]?.url ?? project?.satelliteImage?.url ?? '/images/placeholder.jpg';

  return (
    <div className="w-full bg-gray-100 rounded-2xl flex flex-col items-center gap-3">
      <div className="w-full">
        <div className="w-full h-60 md:h-72 bg-cover bg-center relative rounded-t-2xl overflow-hidden">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50 rounded-t-2xl z-10" />

          {/* título */}
          <div className="absolute top-4 md:top-7 left-4 md:left-7 z-20 flex items-center justify-center border border-white/60 rounded-full py-1 px-3">
            <h1 className="text-white font-aeonik text-sm md:text-[21px]">Detalles del proyecto</h1>
          </div>

          {/* nombre */}
          <div className="absolute bottom-4 md:bottom-7 left-4 md:left-7 z-20 flex items-center gap-1 md:gap-2 py-1 px-2 md:px-3">
            <div className="flex flex-col">
              <h2 className="text-softMint text-lg md:text-[21px] font-aeonik font-medium">
                Nombre
              </h2>
              <h3 className="font-aeonik font-bold text-white text-xl md:text-[29px]">
                {project?.name ?? 'Proyecto'}
              </h3>
            </div>
          </div>

          {/* imagen */}
          <Image
            src={imageUrl}
            alt={project?.name ?? 'Proyecto'}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* descripción */}
        <div className="bg-white p-4 md:p-10 flex flex-col gap-4 rounded-b-2xl">
          <h3 className="text-customGray font-aeonik font-medium text-lg md:text-[21px]">
            Descripción:
          </h3>
          <p className="text-forestGreen font-neueMontreal text-sm md:text-[18px]">
            {project?.description ?? 'Sin descripción disponible.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightDetails;
