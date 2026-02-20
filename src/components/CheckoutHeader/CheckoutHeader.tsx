import React from 'react';
import HeaderBackground from '@/components/HeaderBackground/HeaderBackground';
import BackButton from '@/components/BackButton/BackButton';
import ProjectDetails from '@/components/ProjectDetails/ProjectDetails';
import type { Project } from '@/types/project';

interface CheckoutHeaderProps {
  onGoBack: () => void;
  methodologyName: string;
  project: Project | null;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ onGoBack, methodologyName, project }) => {
  const firstMethodology =
    Array.isArray(project?.methodologies) && project.methodologies.length > 0
      ? project.methodologies[0]
      : null;

  const coverImage =
    typeof project?.coverImage === 'object' &&
    project?.coverImage !== null &&
    'url' in project.coverImage
      ? project.coverImage.url
      : '/images/placeholder.jpg';

  return (
    <HeaderBackground
      coverImage={coverImage}
      containerClassName="relative w-full h-[300px] lg:h-[400px] bg-cover bg-center rounded-t-3xl"
      overlayClassName="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-start justify-center px-5 md:px-10 gap-5 rounded-t-3xl"
    >
      <BackButton onGoBack={onGoBack} text="Volver al proyecto" />

      <h1 className="text-white text-2xl md:text-[40px] font-aeonik font-bold mt-10 md:mt-0">
        {project?.name ?? ''}
      </h1>

      <ProjectDetails
        projectKey={project?.projectID ?? ''}
        country={project?.country ?? ''}
        category={project?.category ?? 'Categoría'}
        methodology={firstMethodology?.name ?? ''}
        methodologyName={methodologyName}
      />
    </HeaderBackground>
  );
};

export default CheckoutHeader;
