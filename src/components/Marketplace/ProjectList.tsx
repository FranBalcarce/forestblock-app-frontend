import React, { useState } from 'react';
import SortDropdown from '@/components/SortDropdown/SortDropdown';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import { ProjectListProps } from './types';
import ViewToggle from '../ViewToggle/ViewToggle';
import MapView from '../ProjectInfo/MapView';
import { useGallery } from '@/hooks/useGallery';
import { FiFilter } from 'react-icons/fi';

interface ExtendedProjectListProps extends ProjectListProps {
  openFilters: () => void;
  actionRenderer?: (project: ProjectListProps['projects'][number]) => React.ReactNode;
}

const ProjectList: React.FC<ExtendedProjectListProps> = ({
  loading,
  projects,
  sortBy,
  setSortBy,
  openFilters,
  actionRenderer,
}) => {
  const [currentView, setCurrentView] = useState('grid');
  const { customIcon } = useGallery({ images: projects.map((p) => p.images[0]) });

  const renderProjects = () => {
    if (currentView === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-5">
          {projects.map((project) => (
            <ProjectCard key={project.key} project={project} actionRenderer={actionRenderer} />
          ))}
        </div>
      );
    } else if (currentView === 'list') {
      return (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.key} project={project} actionRenderer={actionRenderer} />
          ))}
        </div>
      );
    } else if (currentView === 'map') {
      const projectLocations = projects.map((project) => ({
        coordinates: [
          project.location.geometry.coordinates[1],
          project.location.geometry.coordinates[0],
        ] as [number, number],
        name: project.name,
      }));

      return (
        <div className="h-96 bg-gray-200">
          <MapView projectLocations={projectLocations} customIcon={customIcon} />
        </div>
      );
    }
  };

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

      {loading ? <SkeletonLoader /> : renderProjects()}
    </div>
  );
};

export default ProjectList;
