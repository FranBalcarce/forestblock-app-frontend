'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { DevProject } from '@/data/devProjects';

import BackgroundImage from './BackgroundImage';
import OverlayContent from './OverlayContent';
import { formatVintages } from '@/utils/formatVintages';

interface Props {
  project: DevProject;
}

export default function DevProjectCard({ project }: Props) {
  const router = useRouter();

  // 🔥 usamos directamente la imagen de card
  const projectImage = project.cardImage;

  const vintages = formatVintages([]);

  const handleContact = () => {
    window.open('https://www.forestblock.tech/contact/contacto', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-md text-center transition-transform hover:scale-105 hover:shadow-lg h-[300px] sm:h-[360px] lg:h-[320px]">
      <BackgroundImage imageUrl={projectImage} />

      <OverlayContent
        vintages={vintages}
        country={project.country ?? ''}
        category={project.tipo}
        name={project.name}
        price={null} // 🔥 no hay precio en dev projects
        onPurchase={handleContact}
        sdgs={0}
        sdgsArray={[]}
      />
    </div>
  );
}
