import React, { useState } from 'react';
import SortDropdown from '@/components/SortDropdown/SortDropdown';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import ViewToggle from '../ViewToggle/ViewToggle';
import MapView from '../ProjectInfo/MapView';
import { useGallery } from '@/hooks/useGallery';
import { FiFilter } from 'react-icons/fi';

import type { Project, Image as ProjectImage } from '@/types/project';
import type { SortBy } from '@/types/marketplace';

interface ProjectListProps {
  loading: boolean;
  projects: Project[];
  sortBy: SortBy;
  setSortBy: (value: SortBy) => void;
  openFilters: () => void;
  actionRenderer?: (project: Project) => React.ReactNode; // ✅ FIX
}

const ProjectList: React.FC<ProjectListProps> = ({
  loading,
  projects,
  sortBy,
  setSortBy,
  openFilters,
  actionRenderer,
}) => {
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'map'>('grid');

  /* normalizamos imágenes para el mapa */
  const galleryImages: ProjectImage[] = projects
    .map((p) => p.images?.[0])
    .filter((img): img is ProjectImage => Boolean(img));

  const { customIcon } = useGallery({ images: galleryImages });

  if (loading) return <SkeletonLoader />;

  if (!projects.length) {
    return <p className="text-gray-500">No hay proyectos para mostrar</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap justify-end items-center gap-4 mb-5 md:my-10">
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

        <button
          className="py-2 px-4 bg-white text-gray-800 rounded-full flex items-center gap-2 lg:hidden"
          onClick={openFilters}
        >
          <FiFilter /> Filtrar
        </button>

        <ViewToggle currentView={currentView} setView={setCurrentView} />
      </div>

      {currentView !== 'map' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.key} project={project} actionRenderer={actionRenderer} />
          ))}
        </div>
      )}

      {currentView === 'map' && (
        <div className="h-96 bg-gray-200 rounded-xl overflow-hidden">
          <MapView
            projectLocations={projects
              .filter((p) => p.location?.geometry?.coordinates)
              .map((project) => ({
                coordinates: [
                  project.location!.geometry!.coordinates[1],
                  project.location!.geometry!.coordinates[0],
                ] as [number, number],
                name: project.name,
              }))}
            customIcon={customIcon}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectList;
