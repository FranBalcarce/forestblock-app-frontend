import React, { useState } from 'react';
import SortDropdown from '@/components/SortDropdown/SortDropdown';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import ViewToggle from '../ViewToggle/ViewToggle';
import MapView from '../ProjectInfo/MapView';
import { useGallery } from '@/hooks/useGallery';
import { FiFilter } from 'react-icons/fi';

import type { Project } from '@/types/project';
import type { SortBy } from '@/types/marketplace';

interface ProjectListProps {
  loading: boolean;
  projects: Project[];
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  openFilters: () => void;
  actionRenderer?: (project: Project) => React.ReactNode;
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

  const { customIcon } = useGallery({
    images: projects.map((p) => p.images?.[0]),
  });

  /* ✅ handlers EXPLÍCITOS (clave para TS) */
  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
  };

  const handleViewChange = (view: 'grid' | 'list' | 'map') => {
    setCurrentView(view);
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap justify-end items-center gap-4 mb-5 md:my-10">
        <SortDropdown sortBy={sortBy} setSortBy={handleSortChange} />

        <button
          className="py-2 px-4 bg-white text-gray-800 rounded-full flex items-center gap-2 lg:hidden"
          onClick={openFilters}
        >
          <FiFilter /> Filtrar
        </button>

        <ViewToggle currentView={currentView} setView={handleViewChange} />
      </div>

      {currentView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.key} project={project} actionRenderer={actionRenderer} />
          ))}
        </div>
      )}

      {currentView === 'list' && (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.key} project={project} actionRenderer={actionRenderer} />
          ))}
        </div>
      )}

      {currentView === 'map' && (
        <div className="h-96 bg-gray-200">
          <MapView
            projectLocations={projects.map((project) => ({
              coordinates: [
                project.location.geometry.coordinates[1],
                project.location.geometry.coordinates[0],
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
