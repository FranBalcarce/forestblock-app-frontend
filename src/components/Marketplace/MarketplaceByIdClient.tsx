'use client';

import useMarketplace from '@/hooks/useMarketplace';
import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const { project, loading, handleRetire } = useMarketplace(id);

  if (loading) return null;
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
