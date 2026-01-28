'use client';

import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
import type { SellableProject } from '@/types/marketplace';

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const { filteredProjects, loading, handleRetire } = useMarketplace(id);

  if (loading) return null;

  const project = filteredProjects.find((p): p is SellableProject => p.key === id);

  if (!project) return null;

  return (
    <ProjectInfo
      project={project}
      matches={[]}
      displayPrice={project.minPrice !== undefined ? project.minPrice.toFixed(2) : '—'}
      selectedVintage=""
      priceParam={project.minPrice !== undefined ? project.minPrice.toString() : null}
      handleRetire={handleRetire}
      isPricesLoading={false}
    />
  );
}
