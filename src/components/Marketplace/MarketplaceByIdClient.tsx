'use client';

import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const { filteredProjects, loading, handleRetire } = useMarketplace(id);

  if (loading) return null;

  const project = filteredProjects.find((p) => p.key === id);

  if (!project) return null;

  return (
    <ProjectInfo
      project={project}
      selectedVintage=""
      handleRetire={handleRetire}
      isPricesLoading={false}
    />
  );
}
