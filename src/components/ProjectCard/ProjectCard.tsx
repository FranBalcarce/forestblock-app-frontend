import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import BackgroundImage from './BackgroundImage';
import OverlayContent from './OverlayContent';
import { formatVintages } from '@/utils/formatVintages';
import { getProjectImage } from '@/utils/getProjectImage';

interface ProjectCardProps {
  project: Project;
  actionRenderer?: (project: Project) => React.ReactNode;
}

export default function ProjectCard({ project, actionRenderer }: ProjectCardProps) {
  const router = useRouter();

  const isDevProject = project.key?.startsWith('nf-');

  const handlePurchase = () => {
    if (isDevProject) {
      router.push(`/new-feature/${project.key}`);
      return;
    }

    const price = project.displayPrice ?? project.price ?? '';
    const vintages = (project.vintages ?? []).join(',');

    const qs = new URLSearchParams();
    if (price) qs.set('price', String(price));
    if (vintages) qs.set('vintages', vintages);

    router.push(`/marketplace/${project.key}?${qs.toString()}`);
  };

  const projectImage = getProjectImage(project);
  const vintages = formatVintages(project.vintages);

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-md text-center transition-transform hover:scale-105 hover:shadow-lg h-[300px] sm:h-[360px] lg:h-[320px]">
      <BackgroundImage imageUrl={projectImage} />

      <OverlayContent
        vintages={vintages}
        country={project.country}
        category={project.methodologies?.[0]?.category}
        name={project.name}
        price={project.displayPrice ?? project.price}
        onPurchase={handlePurchase}
        sdgs={project.sustainableDevelopmentGoals?.length ?? 0}
        sdgsArray={project.sustainableDevelopmentGoals ?? []}
      />

      {actionRenderer && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          {actionRenderer(project)}
        </div>
      )}
    </div>
  );
}

// import { useRouter } from 'next/navigation';
// import { Project } from '@/types/project';
// import BackgroundImage from './BackgroundImage';
// import OverlayContent from './OverlayContent';
// import { formatVintages } from '@/utils/formatVintages';
// import { getProjectImage } from '@/utils/getProjectImage';

// interface ProjectCardProps {
//   project: Project;
//   actionRenderer?: (project: Project) => React.ReactNode; // opcional
// }

// export default function ProjectCard({ project, actionRenderer }: ProjectCardProps) {
//   const router = useRouter();

//   const handlePurchase = () => {
//     router.push(
//       `/marketplace/${project?.key}?price=${project?.price}&vintages=${project?.vintages}`
//     );
//   };

//   const projectImage = getProjectImage(project);
//   const vintages = formatVintages(project.vintages);

//   return (
//     <div className="relative bg-white rounded-xl overflow-hidden shadow-md text-center transition-transform hover:scale-105 hover:shadow-lg h-[300px] sm:h-[360px] lg:h-[320px]">
//       <BackgroundImage imageUrl={projectImage} />
//       <OverlayContent
//         vintages={vintages}
//         country={project.country}
//         category={project.methodologies[0]?.category}
//         name={project.name}
//         price={project.price}
//         onPurchase={handlePurchase}
//         sdgs={project.sustainableDevelopmentGoals.length}
//         sdgsArray={project.sustainableDevelopmentGoals}
//       />

//       {actionRenderer && (
//         <div className="absolute bottom-4 left-0 right-0 flex justify-center">
//           {actionRenderer(project)}
//         </div>
//       )}
//     </div>
//   );
// }
