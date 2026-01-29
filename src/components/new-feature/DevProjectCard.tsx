import React from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types/project';

import BackgroundImage from '@/components/ProjectCard/BackgroundImage';
import OverlayContent from '@/components/ProjectCard/OverlayContent';
import { formatVintages } from '@/utils/formatVintages';
import { getProjectImage } from '@/utils/getProjectImage';

type Props = {
  project: Project;
};

export default function DevProjectCard({ project }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/new-feature/${project.key}`);
  };

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-md text-center h-[320px]">
      <BackgroundImage imageUrl={getProjectImage(project) ?? '/placeholder.jpg'} />

      <OverlayContent
        vintages={formatVintages(project.vintages ?? [])}
        country={project.country ?? '—'}
        category={project.methodologies?.[0]?.category ?? '—'}
        name={project.name}
        price="Próximamente"
        onPurchase={handleClick}
        sdgs={project.sustainableDevelopmentGoals?.length ?? 0}
        sdgsArray={project.sustainableDevelopmentGoals ?? []}
      />
    </div>
  );
}
