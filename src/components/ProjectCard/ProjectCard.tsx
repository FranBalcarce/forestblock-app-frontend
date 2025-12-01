import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import BackgroundImage from './BackgroundImage';
import OverlayContent from './OverlayContent';
import { formatVintages } from '@/utils/formatVintages';
import { getProjectImage } from '@/utils/getProjectImage';

interface ProjectCardProps {
  project: Project;
  actionRenderer?: (project: Project) => React.ReactNode; // opcional
}

export default function ProjectCard({ project, actionRenderer }: ProjectCardProps) {
  const router = useRouter();

  // 👉 Identifica si es un proyecto de "Nuevos Proyectos"
  const isDevProject = project.key?.startsWith('nf-');

  // 👉 Decide a qué pantalla ir cuando se hace clic en la tarjeta / comprar
  const handlePurchase = () => {
    if (isDevProject) {
      // 🔹 Para "Proyectos en desarrollo"
      router.push(`/new-feature/${project.key}`);
    } else {
      // 🔹 Para proyectos reales del marketplace
      router.push(
        `/marketplace/${project.key}?price=${project.price}&vintages=${project.vintages}`
      );
    }
  };

  const projectImage = getProjectImage(project);
  const vintages = formatVintages(project.vintages);

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-md text-center transition-transform hover:scale-105 hover:shadow-lg h-[300px] sm:h-[360px] lg:h-[320px]">
      {/* Imagen */}
      <BackgroundImage imageUrl={projectImage} />

      {/* Información superpuesta */}
      <OverlayContent
        vintages={vintages}
        country={project.country}
        category={project.methodologies[0]?.category}
        name={project.name}
        price={project.price}
        onPurchase={handlePurchase} // 👉 Usa nuestra función que diferencia rutas
        sdgs={project.sustainableDevelopmentGoals.length}
        sdgsArray={project.sustainableDevelopmentGoals}
      />

      {/* Render opcional para botones personalizados */}
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
