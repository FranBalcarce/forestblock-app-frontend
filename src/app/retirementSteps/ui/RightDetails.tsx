import { Project } from '@/types/project';
import Image from 'next/image';
import React from 'react';
// import { LiaExternalLinkAltSolid } from "react-icons/lia";

const RightDetails = ({ project }: { project: Project | null }) => {
  return (
    <div className="w-full bg-gray-100 rounded-2xl flex flex-col items-center gap-3">
      <div className="w-full">
        <div className="w-full h-60 md:h-72 bg-cover bg-center relative rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black/50 rounded-t-2xl"></div>
          <div className="absolute top-4 md:top-7 left-4 md:left-7 flex items-center justify-center border border-white/60 rounded-full py-1 px-3">
            <h1 className="text-white font-aeonik text-sm md:text-[21px]">Detalles del proyecto</h1>
          </div>
          <div className="absolute bottom-4 md:bottom-7 left-4 md:left-7 flex items-center gap-1 md:gap-2 py-1 px-2 md:px-3">
            <div className="flex flex-col">
              <h2 className="text-softMint text-lg md:text-[21px] font-aeonik font-medium">
                Nombre
              </h2>
              <h3 className="font-aeonik font-bold text-white text-xl md:text-[29px]">
                {project?.name}
              </h3>
            </div>
          </div>
          <Image
            src={
              project?.images?.[0]?.url || project?.satelliteImage?.url || '/images/placeholder.jpg'
            }
            alt={project?.name || 'Proyecto'}
            width={400}
            height={300}
          />
        </div>

        <div className="bg-white p-4 md:p-10 flex flex-col gap-4 rounded-b-2xl">
          <h3 className="text-customGray font-aeonik font-medium text-lg md:text-[21px]">
            Descripción:
          </h3>
          <p className="text-forestGreen font-neueMontreal text-sm md:text-[18px]">
            {project?.description}
          </p>
        </div>
      </div>
      {/* <div className="w-full bg-white p-4 md:p-10 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Image
            width={30}
            height={30}
            src="/images/black_logo.svg"
            alt="Logo"
          />
          <h4 className="text-customGray text-sm md:text-[18px] font-aeonik">
            Certificado de Retiro de Carbono
          </h4>
        </div>
        <p className="text-xs md:text-[16px] text-customGray font-aeonik">
          Esto representa el retiro permanente de un activo de carbono. Este
          retiro y los datos asociados son registros públicos inmutables.
        </p>
        <button
          disabled={true}
          className="border-forestGreen border-2 text-forestGreen px-4 md:px-10 py-2 md:py-3 rounded-xl flex justify-center items-center gap-3 cursor-not-allowed"
        >
          <LiaExternalLinkAltSolid className="w-4 h-4 md:w-6 md:h-6" />
          <span className="text-sm md:text-[18px] font-aeonik font-medium">
            VER PROCEDENCIA DEL CARBONO
          </span>
        </button>
      </div> */}
    </div>
  );
};

export default RightDetails;
