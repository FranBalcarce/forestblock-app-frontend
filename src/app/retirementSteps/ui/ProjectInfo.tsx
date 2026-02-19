import React from 'react';
import { Project } from '@/types/project';

type ProjectInfoProps = {
  project: Project | null;
  computedVintageIndex: number | null;
};

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project, computedVintageIndex }) => {
  const firstMethodology =
    Array.isArray(project?.methodologies) && project.methodologies.length > 0
      ? project.methodologies[0]
      : null;

  const vintageValue =
    project?.selectedVintage !== undefined && project?.selectedVintage !== null
      ? String(project.selectedVintage)
      : computedVintageIndex !== null &&
          computedVintageIndex !== -1 &&
          Array.isArray(project?.vintages)
        ? project.vintages[computedVintageIndex]
        : 'No disponible';

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 my-5">
        <div>
          <h4 className="text-forestGreen font-aeonik text-lg md:text-[21px] font-medium">
            Proyecto:
          </h4>
          <h5 className="text-forestGreen font-aeonik text-base md:text-[18px]">
            {project?.key ?? '—'}
          </h5>
        </div>

        <div>
          <h4 className="text-forestGreen font-aeonik text-lg md:text-[21px] font-medium">Tipo:</h4>
          <h5 className="text-forestGreen font-aeonik text-base md:text-[18px]">
            {firstMethodology?.category ?? 'No disponible'}
          </h5>
        </div>

        <div>
          <h4 className="text-forestGreen font-aeonik text-lg md:text-[21px] font-medium">
            Metodología:
          </h4>
          <h5 className="text-forestGreen font-aeonik text-base md:text-[18px]">
            {firstMethodology?.id ?? 'No disponible'}
          </h5>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 my-5">
        <div>
          <h4 className="text-forestGreen font-aeonik text-lg md:text-[21px] font-medium">
            País / Región:
          </h4>
          <h5 className="text-forestGreen font-aeonik text-base md:text-[18px]">
            {project?.country ?? 'No disponible'}
          </h5>
        </div>

        <div>
          <h4 className="text-forestGreen font-aeonik text-lg md:text-[21px] font-medium">
            Año de emisión:
          </h4>
          <h5 className="text-forestGreen font-aeonik text-base md:text-[18px]">{vintageValue}</h5>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
